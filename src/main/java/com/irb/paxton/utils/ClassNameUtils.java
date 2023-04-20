package com.irb.paxton.utils;

import com.irb.paxton.exceptions.handler.common.DuplicateClassNameException;
import com.irb.paxton.exceptions.handler.common.EnumNotFoundException;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

public class ClassNameUtils {

    private ClassNameUtils() {
    }

    /**
     * Returns the loaded Class found in the searchPackages
     *
     * @param classname      the simple class name (e.g. "String")
     * @param searchPackages String[] of packages to search.
     *                       <li>Place the more important packages at the top since the first Class
     *                       found is returned</li>
     *                       <code>//Example
     *                       public static final String[] searchPackages = {
     *                       "java.lang",
     *                       "java.util",
     *                       "my.company",
     *                       "my.company.other" };
     *                       </code>
     * @return the loaded Class (guaranteed to be unique among the searchPackages) or null if not found
     * @throws RuntimeException if more than one class of the same classname found in multiple packages
     */
    public static Class<?> findClassByNameNoDupes(String classname, String[] searchPackages) {
        if (searchPackages == null || searchPackages.length == 0) {
            try {
                var classes = getClasses("com.irb.paxton");
                searchPackages = classes.stream().map(Class::getPackageName).distinct().toArray(String[]::new);
            } catch (ClassNotFoundException e) {
                throw new EnumNotFoundException(e);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        Class<?> foundClass = null;
        for (String searchPackage : searchPackages) {
            try {
                boolean wasNull = foundClass == null;
                foundClass = Class.forName(searchPackage + "." + classname);
                if (!wasNull)
                    throw new DuplicateClassNameException("%s exists in multiple packages!".formatted(classname));
            } catch (ClassNotFoundException e) {
                //not in this package, try another
            }
        }
        return foundClass;
    }

    /**
     * Scans all classes accessible from the context class loader which belong to the given package and subpackages.
     *
     * @param packageName The base package
     * @return The classes
     * @throws ClassNotFoundException
     * @throws IOException
     */
    private static List<Class> getClasses(String packageName) throws ClassNotFoundException, IOException {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        assert classLoader != null;
        String path = packageName.replace('.', '/');
        Enumeration<URL> resources = classLoader.getResources(path);
        List<File> dirs = new ArrayList<>();
        while (resources.hasMoreElements()) {
            URL resource = resources.nextElement();
            dirs.add(new File(resource.getFile()));
        }
        var classes = new ArrayList<Class>();
        for (File directory : dirs) {
            classes.addAll(findClasses(directory, packageName));
        }
        return classes.stream().toList();
    }

    /**
     * Recursive method used to find all classes in a given directory and sub-dirs.
     *
     * @param directory   The base directory
     * @param packageName The package name for classes found inside the base directory
     * @return The classes
     * @throws ClassNotFoundException
     */
    private static List<Class> findClasses(File directory, String packageName) throws ClassNotFoundException {
        List<Class> classes = new ArrayList<>();
        if (!directory.exists()) {
            return classes;
        }
        File[] files = directory.listFiles();
        assert files != null;
        for (File file : files) {
            if (file.isDirectory()) {
                assert !file.getName().contains(".");
                classes.addAll(findClasses(file, packageName + "." + file.getName()));
            } else if (file.getName().endsWith(".class")) {
                classes.add(Class.forName(packageName + '.' + file.getName().substring(0, file.getName().length() - 6)));
            }
        }
        return classes;
    }
}
