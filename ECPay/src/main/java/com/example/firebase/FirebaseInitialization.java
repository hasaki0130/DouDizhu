package com.example.firebase;

import java.io.FileInputStream;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.FirebaseDatabase;

@Service
public class FirebaseInitialization {

    private FirebaseDatabase firebaseDatabase;

    @PostConstruct
    public void initialization() {
    	//1.在 FirebaseInitialization 类的 initialization 方法中，以确保该方法被调用并正确执行：
    	System.out.println("Initializing Firebase...");
    	
        FileInputStream serviceAccount;
        try {
            serviceAccount = new FileInputStream("./serviceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://gameproject-d9074-default-rtdb.asia-southeast1.firebasedatabase.app").build();

            if (FirebaseApp.getApps().isEmpty()) { //<--- 检查是否已经初始化
                FirebaseApp.initializeApp(options);
            }

            // 获取FirebaseDatabase的实例
            firebaseDatabase = FirebaseDatabase.getInstance();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public FirebaseDatabase getFirebaseDatabase() {
        return firebaseDatabase;
    }
}
