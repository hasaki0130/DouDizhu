package com.example.classes;

public class OrderObject {
	private String user_id;
	private Integer money;
	private String date;
	
	//因為在OrderController直接print物件會印出記憶體位置，所以用source, Generate to String()來印出String內容
	@Override
	public String toString() {
		return "OrderObject [user_id=" + user_id + ", money=" + money + ", date=" + date + "]";
	}

	//用source, Generate Getters and Setters讓form.html可以印出userId, amount, time
	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public Integer getMoney() {
		return money;
	}

	public void setMoney(Integer money) {
		this.money = money;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}	
}


//	@Override
//	public String toString() {
//		return "OrderObject [userId=" + userId + ", amount=" + amount + "]";
//	}
