package com.example.entity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Money {

	private String user_id;
	private String cash; // cash 數值改回字串
	//private long date;
	private LocalDateTime date; // date 字段现在是 LocalDateTime 类型

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getCash() {
		return cash;
	}

	public void setCash(String cash) {
		this.cash = cash;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}

	// 示例：格式化日期时间为字符串
	public String getFormattedDate() {//getFormattedDate 方法将 LocalDateTime 对象格式化为字符串。
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		return date.format(formatter);
	}

	// 示例：将字符串转换为LocalDateTime
	public void setDateFromString(String dateString) {//setDateFromString 方法将一个日期时间字符串转换为 LocalDateTime 对象。
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		this.date = LocalDateTime.parse(dateString, formatter);
	}

	// 其他日期时间操作...
}

/* JSON
LocalDateTime
{
"user_id": "Leo",
"cash": 5757,
"date": "2018-07-10T12:17:34"
}

long
{
    "user_id": "Leo",
    "cash": 5757,
    "date": 1531205854000
}
*/