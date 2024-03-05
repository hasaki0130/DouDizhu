package com.example.ECPay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import ecpay.payment.integration.AllInOne;
import ecpay.payment.integration.domain.AioCheckOutALL;

@Service
public class OrderService {

	public String ecpayCheckout(String amount) {
		
		String uuId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 20);
		
		AllInOne all = new AllInOne("");
		
		AioCheckOutALL obj = new AioCheckOutALL();
		obj.setMerchantTradeNo(uuId);
		obj.setMerchantTradeDate("2017/01/01 08:05:23");
		obj.setTotalAmount(amount);
		obj.setTradeDesc("test Description");
		obj.setItemName("TestItem");
		obj.setReturnURL("http://localhost:8080/form.html");
		obj.setOrderResultURL("http://localhost:8080/ecpay/response");
		obj.setNeedExtraPaidInfo("N");
		String form = all.aioCheckOut(obj, null);
		
		return form;
	}
}
