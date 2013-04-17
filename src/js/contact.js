var Contact = function(n, p, e, pic){ // name, phone number, email
	this.name = n;
	this.phone = p;
	this.email = e;
	this.storePersonImage;
	this.typeImage;
	var picture = typeof pic !== 'undefined' ? pic:"images/default.png";
	
	this.toString = function(){			
		var str = this.name + ", " + this.phone + ", " + this.email;
		return str;
	}
	
	this.getPicture = function() {
        return picture; 
    }
}
