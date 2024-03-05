package com.example.ECPay.controller;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
//引入所需的类和接口
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.ECPay.service.MoneyService;
import com.example.ECPay.service.OrderService;
import com.example.classes.OrderObject;
import com.example.classes.Person;
import com.example.entity.Money;
import com.example.firebase.FirebaseInitialization;
import com.example.utils.Receive;

//Import the necessary CORS annotation
import org.springframework.web.bind.annotation.CrossOrigin;

//声明这是一个REST控制器
@RestController
public class OrderController {

	@Autowired // 自动注入OrderService
	OrderService orderService;
	User user;

	@Autowired // 这里添加@Autowired注解以自动注入FirebaseInitialization实例
	private FirebaseInitialization firebaseInitialization;
	
    @Autowired
    private MoneyService moneyService;
    
    @CrossOrigin(origins = "http://localhost:7456") // or use "*" to allow all origins
    @PostMapping("/amountToSpringboot")
    public String amountToSpringboot(@RequestBody String amountAsString) {
        int amount = Integer.parseInt(amountAsString); // 將字符串轉換為整數
        // 使用 amount 變量
        System.out.println("Received amount: " + amount);
        
        //原本打算使用Java直接開啟瀏覽器，但沒反應...
//        if (amount != 0) {
//            try {
//                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
//                    Desktop.getDesktop().browse(new URI("http://localhost:8080/form.html"));
//                }
//            } catch (IOException | URISyntaxException e) {
//                e.printStackTrace();
//                return "Error opening browser: " + e.getMessage();
//            }
//        }
        
        return "處理完成";
    }   

	// 处理POST请求到/ecpayCheckout路径
	// ecpayCheckout 方法：处理发送到 /ecpayCheckout 的POST请求，用于启动电子支付流程。它接收一个 OrderObject
	// 类型的对象作为请求体，调用 orderService 的 ecpayCheckout 方法，并返回结果。
    @CrossOrigin(origins = "http://localhost:7456")
	@PostMapping("/ecpayCheckout") // 使用@PostMapping注解定义路径映射，处理POST请求到/ecpayCheckout
	public String ecpayCheckout(@RequestBody String amount) {// 建立一個package裡面放classes，加入OrderObject，//
																// 使用@RequestBody注解处理请求数据
		String aioCheckOutALLForm = orderService.ecpayCheckout(amount);// 调用orderService的方法
		//System.out.println(ooj);// print物件會印出記憶體位置，所以去OrderObject用source, Generate to String()來印出String內容，//
								// 打印请求对象
		return aioCheckOutALLForm;// 返回处理结果
	}

	// 处理POST请求到/ecpay/response路径
	// handleECPayResponse 方法：处理发送到 /ecpay/response
	// 的POST请求，用于接收电子支付的响应。它解析响应数据，并根据返回的交易结果代码（RtnCode）来判断交易的状态。
	@PostMapping("/ecpay/response") // 路径映射，处理POST请求到/ecpay/response
	public String handleECPayResponse(@RequestBody String receive) {// 请求数据处理
		// 2.在 OrderController 类的 handleECPayResponse 方法中，以检查方法是否被调用以及 map 是否包含预期的数据：
		System.out.println("Received ecpay response: " + receive);

		Map<String, String> map = Receive.parseStringToMap(receive);// 将接收的字符串转换为Map

		// 检查firebaseInitialization是否为null
		if (firebaseInitialization == null) {
			System.out.println("FirebaseInitialization is null");
			return "服务器内部错误：Firebase服务未初始化";
		} else {
			System.out.println("FirebaseInitialization is not null");
		}

		map.get("RtnCode");// 获取返回代码

		// 檢查交易是否成功
		if (map.get("RtnCode").equals("1")) {
			// 處理成功的交易
			// 這裡可以添加您的業務邏輯，例如更新訂單狀態、記錄交易資訊等

			/* a. Firebase Realtime Database寫法
			// 以下是添加到Firebase的示例代码
			String userId = "Leo";// 获取当前登录用户的ID
			String cash = map.get("TradeAmt"); // 从绿界获取交易金额
			LocalDateTime date = LocalDateTime.now(); // 获取当前时间作为交易完成时间

			// 构建要发送的数据
			Map<String, Object> transactionData = new HashMap<>();
			transactionData.put("user_id", userId);
			transactionData.put("cash", cash);
			transactionData.put("date", date.toString());

			// 发送数据到Firebase
			// 使用注入的FirebaseInitialization服务获取FirebaseDatabase的引用
			FirebaseDatabase firebaseDatabase = firebaseInitialization.getFirebaseDatabase();
			// DatabaseReference transactionsRef =
			// firebaseDatabase.getReference("transactions");
			// transactionsRef.push().setValueAsync(transactionData);

			DatabaseReference transactionsRef = firebaseDatabase.getReference("transactions");
			
			// 推送数据
			ApiFuture<Void> future = transactionsRef.push().setValueAsync(transactionData);

			// 添加成功监听器
			ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
			    @Override
			    public void onSuccess(Void result) {
			        System.out.println("Data successfully written to Firebase.");
			    }

			    @Override
			    public void onFailure(Throwable t) {
			        System.err.println("Error writing data to Firebase: " + t.getMessage());
			    }
			}, MoreExecutors.directExecutor()); // 使用 directExecutor 执行回调
			*/
			
			// 创建 Money 实例并设置属性
            Money money = new Money();
            //money.setUser_id(""); // 这里应该是动态获取用户ID，而不是硬编码
            money.setCash(map.get("TradeAmt"));
            money.setDate(LocalDateTime.now());

            // 使用 MoneyService 保存 Money 对象
            try {
                String updateTime = moneyService.saveMoney(money);
                System.out.println("Transaction successfully written to Firestore with update time: " + updateTime);
                return "交易成功";
            } catch (InterruptedException | ExecutionException e) {
                System.err.println("Error saving transaction to Firestore: " + e.getMessage());
                return "交易失败";
            }        
        // ...其他逻辑...
			
			//return "交易成功";// 交易成功的处理
		} else if (map.get("RtnCode").equals("10300066")) {
			return "交易付款結果待確認中";// 特定状态的处理
		} else {
			// 處理失敗的交易
			return "交易失敗: " + map.get("RtnMsg");// 交易失败的处理
		}

	}

	// 处理POST请求到/createUser路径
	// postExample 方法：处理发送到 /createUser 的POST请求，用于创建用户。它接收一个 Person
	// 类型的对象作为请求体，并返回一个简单的字符串作为响应。
	@PostMapping("/createUser") // 路径映射，处理POST请求到/createUser
	public String postExample(@RequestBody Person person) throws InterruptedException, ExecutionException {// 请求数据处理
		// return "Created User " + person.getName();
		System.out.println(person);// 打印请求对象
		return "abc (PostMapping(\"/createUser\"))";// 返回一个简单的响应
	}
}

//用途解释：
//1.ecpayCheckout 方法：处理发送到 /ecpayCheckout 的POST请求，用于启动电子支付流程。它接收一个 OrderObject 类型的对象作为请求体，调用 orderService 的 ecpayCheckout 方法，并返回结果。
//2.handleECPayResponse 方法：处理发送到 /ecpay/response 的POST请求，用于接收电子支付的响应。它解析响应数据，并根据返回的交易结果代码（RtnCode）来判断交易的状态。
//3.postExample 方法：处理发送到 /createUser 的POST请求，用于创建用户。它接收一个 Person 类型的对象作为请求体，并返回一个简单的字符串作为响应。
//这段代码展示了使用Spring框架创建RESTful API的常见模式，其中包含了服务注入、路径映射、请求数据处理等关键元素。

//服务注入：通过@Autowired注解，Spring会自动注入OrderService对象。这允许OrderController类使用OrderService中定义的方法和功能，而不需要手动创建OrderService的实例。
//路径映射：使用@PostMapping注解定义了三个不同的路径映射，分别对应不同的HTTP POST请求。每个方法与一个特定的URL路径关联，当该路径接收到POST请求时，相应的方法会被调用。
//请求数据处理：使用@RequestBody注解指定方法参数应该从请求的body中读取。这允许方法直接接收和处理客户端发送的数据。

//这两段代码在电子支付（ECPay）流程中扮演着不同的角色：

//ecpayCheckout 方法：
//这个方法处理发送到/ecpayCheckout路径的POST请求。
//它利用OrderService中的ecpayCheckout方法生成支付所需的表单（aioCheckOutALLForm）。
//aioCheckOutALLForm可能包含HTML表单或是其他结构的字符串，用于向ECPay发起支付请求。
//打印的ooj（一个OrderObject实例）可能包含订单详情，如金额、商品信息等。

//handleECPayResponse 方法：
//这个方法处理发送到/ecpay/response路径的POST请求，通常作为ECPay响应支付请求的回调接口。
//它接收ECPay发送的响应数据（字符串格式），并将其解析为键值对映射（Map<String, String>）。
//根据返回的RtnCode（返回代码），判断交易是否成功，并返回相应的消息。
//关联性和应用：
//关联性：ecpayCheckout方法负责初始化支付流程并生成支付表单，而handleECPayResponse方法负责处理支付后的响应。
//差异：ecpayCheckout主要用于发起支付，handleECPayResponse则用于处理支付结果。
//aioCheckOutALLForm的应用：
//aioCheckOutALLForm的内容通常是一个HTML表单或请求数据，用户通过这个表单完成支付。
//用户完成支付后，ECPay会将支付结果发送到指定的回调URL（如/ecpay/response）。
//handleECPayResponse的结果应用：
//根据handleECPayResponse的结果，您可以更新数据库中的订单状态、记录交易信息，或执行其他后续操作。
//如果RtnCode为"1"，则表示交易成功；其他代码可能表示不同的状态或错误。
//aioCheckOutALLForm结果在/ecpay/response路径的应用：
//实际上，aioCheckOutALLForm的结果（用户支付动作）是通过ECPay处理的，而非直接在/ecpay/response路径中应用。
///ecpay/response路径用于接收ECPay的支付结果响应，它与用户通过aioCheckOutALLForm提交的表单结果间接相关。
//这两个方法共同构成了电子支付流程的两个关键部分：发起支付请求和处理支付结果。
