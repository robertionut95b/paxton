import { Avatar, Divider, Group, Paper, Text, Title } from "@mantine/core";

export default function StudyCard({ withDivider = false }: { withDivider?: boolean }) {
    return (
        <Paper>
            <Group noWrap>
                <Avatar className="self-start" size={"lg"} color={"gray"}>S</Avatar>
                <div className="px-study-heading">
                    <Title order={4}>
                        Stanford University
                    </Title>
                    <Text className="px-study-diploma">
                        Bachelor's degree in Computer Science, 9.5 / 10
                    </Text>
                    <Text className="px-study-years" color="dimmed">
                        2012-2016
                    </Text>
                    <Text className="px-study-specialization mb-4" color="dimmed">
                        Computer Sciences and Informatics & Data Communication strategy
                    </Text>
                    <p className="px-study-description" color="dark">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac arcu consectetur, cursus nulla sed, interdum lectus. Sed tristique nibh sit amet nulla gravida suscipit. Ut nec erat sem. Donec a arcu ex. Aliquam erat sapien, tincidunt non gravida et, porta sed metus. Curabitur consequat, ligula ac iaculis sodales, felis sem cursus metus, vel semper ipsum quam non enim. Morbi ut molestie sapien. Sed mollis accumsan lorem vel auctor.
                    </p>
                    {withDivider && <Divider mt={16} />}
                </div>
            </Group>
        </Paper>
    )
}