package com.example.ECPay.service;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.example.entity.Money;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class MoneyService {

	private static final String COLLECTION_NAME = "money";

	//private static final String COLLECTION_NAME = "transactions";

	public String saveMoney(Money money) throws InterruptedException, ExecutionException {
//		 Firestore dbFirestore = FirestoreClient.getFirestore();
//		 ApiFuture<WriteResult> collectionApiFuture =
//		 dbFirestore.collection(COLLECTION_NAME).document(money.getUser_id()).set(money);
//		 return collectionApiFuture.get().getUpdateTime().toString();
		
		// 使用 add 方法而不是 document().set 方法。这样，Firestore会为您创建一个新的文档，并自动生成唯一的ID
		Firestore dbFirestore = FirestoreClient.getFirestore();
		// 使用add而不是document().set来让Firestore自动生成文档ID
		ApiFuture<DocumentReference> collectionApiFuture = dbFirestore.collection(COLLECTION_NAME).add(money);
		// 等待操作完成并获取生成的文档ID
		DocumentReference documentReference = collectionApiFuture.get();
		return documentReference.getId(); // 返回自动生成的文档ID
		
	}
}
