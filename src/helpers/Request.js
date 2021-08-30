export default class Request{
    static config(){
        return {
            mode: 'cors'
            // headers: {
            //     'Content-Type': 'application/json'
            // }
        }
    }
    
    static formatURL(url, data={}){
        const params = new URLSearchParams(data)
        let params_delimeter = '?';
        if(!url.includes('http')){
            const {hostname, protocol, port} = window.location;
            url = `${protocol}//${hostname}:${port}/api${url}`;
        }

        if(url.includes('?'))
            params_delimeter = '&';
        url += params_delimeter + params;
        return url;
    }
  
    static formatData(data, config={}){
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.set(key, data[key])
        })
        return formData;
    }
    static has_data(data){
        // let has_keys = false;
        try{
            return data.keys().length > 0
        }catch(e){
            return false;
        }
    }
    static async get(url, data={}){
        let response = {},
            status = 200;
        try{
            // const has_keys = this.has_data(data);	
            const parseURL = this.formatURL(url, data);
            await fetch(parseURL, this.config())
                .then(result => result.json())
                .then(data => response = data);
        }catch(e){
            let message = e.message;
            if(message.toLowerCase().includes('fail'))
                message = "Error Connection. Please try again later";
            response = { status: 404, message: message };
        }finally{
            return {status, response};
        }
    }
    static async post(url, data = {}, config={}){
        return await this.formDataRequest(url, data, 'POST', config)
    }

    static async put(url, data = {}, config={}){
        return await this.formDataRequest(url, data, 'PUT', config)
    }

    static async delete(url, data = {}, config={}){
        return await this.formDataRequest(url, data, 'DELETE', config)
    }

    static async options(url, data = {}, config={}){
        return await this.formDataRequest(url, data, 'OPTIONS', config)
    }

    static async formDataRequest(url, data, method="POST", config={}){
        
        let response = {},
            status = 200;
        try{
            const parseURL = this.formatURL(url);
            await fetch(parseURL, {
                    ...this.config(),
                    method,
                    body: this.formatData(data),
                    ...config
                })
                .then(result => {
                    return result.json()
                })
                .then(data => response = data);
        }catch(e){
            let message = e.message;
            console.log('errror ',e.message);
            if(message.toLowerCase().includes('fail'))
                message = "Error Connection. Please try again later";
            response = { status: 404, message: message };
        }finally{
            return {status, response};
        }
    }
}