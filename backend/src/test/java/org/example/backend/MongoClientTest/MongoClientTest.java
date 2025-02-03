package org.example.backend.MongoClientTest;

import com.mongodb.client.MongoClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Assertions;

@SpringBootTest
public class MongoClientTest {

    @Autowired(required = false) // Important: Make this optional
    private MongoClient mongoClient;

    @Test
    void testMongoClient() {
        Assertions.assertNotNull(mongoClient, "MongoClient is null. Check MongoDB connection.");
        if (mongoClient != null) {
            mongoClient.listDatabaseNames().forEach(System.out::println); // Optional: Verify connection
        }
    }
}