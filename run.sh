#!/bin/bash

MAVEN_OPTS="-Xms256m -Xmx1G -XX:PermSize=300m" mvn integration-test -Pamp-to-war -Dmaven.tomcat.port=8081