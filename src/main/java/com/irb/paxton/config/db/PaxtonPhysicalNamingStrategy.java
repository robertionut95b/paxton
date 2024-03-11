package com.irb.paxton.config.db;

import io.hypersistence.utils.hibernate.naming.CamelCaseToSnakeCaseNamingStrategy;
import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

public class PaxtonPhysicalNamingStrategy extends CamelCaseToSnakeCaseNamingStrategy {

    @Override
    public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment context) {
        Identifier identifier = new Identifier(TABLE_PREFIX + "_" + name.getText(), name.isQuoted());
        return super.toPhysicalTableName(identifier, context);
    }
}
