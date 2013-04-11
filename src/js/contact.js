var Contact = function(n, p, e){ // name, phone number, email
	this.name = n;
	this.phone = p;
	this.email = e;
	this.storePersonImage;
	this.typeImage;
	
	this.toString = function(){			
		var str = this.name + ", " + this.phone + ", " + this.email;
		return str;
	}
}