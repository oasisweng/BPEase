package com.cod.cordova;

import java.io.Serializable;



public class numericBP implements Serializable{
	
	
    public double Systolic;                  /*systolic BP*/
    public double Diastolic;                 /*diastolic BP*/  
    public double MAP;                       /*mean value */
    public double pulse;                     /*pulse per minute*/
    public String time;                 /*timestamp of this measurement
                                          YYYY-MM-DD 23:59:5900*/
    
    public numericBP(){
    	Systolic = 0;
    	Diastolic = 0;
    	MAP = 0;
    	time = "0000-00-00 00:00:0000";
    }
}
