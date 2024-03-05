package com.example.ECPay.controller;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ECPay.service.MoneyService;
import com.example.entity.Money;

@RestController
@RequestMapping("/api")
public class MoneyController {

	@Autowired
	private MoneyService moneyService;
	
	@PostMapping("/money")
	public String saveMoney(@RequestBody Money money) throws InterruptedException, ExecutionException {
		return moneyService.saveMoney(money);
	}
}
