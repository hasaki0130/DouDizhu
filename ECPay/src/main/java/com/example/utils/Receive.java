package com.example.utils;

import java.util.HashMap;
import java.util.Map;

public class Receive {
	public static Map<String, String> parseStringToMap(String inputString) {
        Map<String, String> keyValueMap = new HashMap<>();
        
        // 分割字符串，首先按'&'分割成键值对
        String[] keyValuePairs = inputString.split("&");
        
        for (String pair : keyValuePairs) {
            // 再按'='分割键和值
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];
                keyValueMap.put(key, value);
            }
        }
                
        return keyValueMap;
    }
}
