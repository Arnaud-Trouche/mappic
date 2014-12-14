package main;

import (
	"fmt"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"time"
	"crypto/hmac"
	"crypto/sha1"
	"strconv"
	"encoding/hex"
	"bytes"
	"encoding/base64"
	"flag"
	"os"
)

var serverAddress string

var login string
var passwordHash string

var data map[string]string

func main() {
	
	PserverAddress := flag.String("server", "aa", "Server address")
	Plogin := flag.String("login", "", "User login")
	PpasswordHash := flag.String("password", "", "User password")
	Pfilename := flag.String("file","","Filename to upload")

	flag.Parse()
	serverAddress=*PserverAddress
	login=*Plogin
	passwordHash=computeSha1(*PpasswordHash)
	filename:=*Pfilename
	
	var res map[string]interface{}

	res = API("GET","/user", "")
	

	if (res["success"].(bool) == false) {
		fmt.Println("User not recognized, creating it...")
		res=API("POST","/user", `{"login":"`+login+`", "passwordHash":"`+passwordHash+`", "mail":"simon@legtux.org"}`)
		if (res["success"].(bool) == false) {
			fmt.Println("Login already exists, aborting.")
			return;
		}
	} else {
		fmt.Println("User logged in !")
	}
	
	
	fmt.Println("Uploading picture...")
	file,_ := ioutil.ReadFile(filename)
	b64 := base64.StdEncoding.EncodeToString(file)
	res=API("POST","/pic",
	`{
		"picture":"`+b64+`",
		"date":"2014-12-14",
		"gps":{
			"latitude":45,
			"longitude":55
		}
	}`)
	
	if (res["success"].(bool) == true) {
		fmt.Println("Uploaded !")
		fmt.Println("Link : "+serverAddress+"/data/"+res["id"].(string)+".jpg")
	} else {
		fmt.Println("Error while uploading")
	}
	
}

func API(method string, uri string, postData string) map[string]interface{} {
	client := &http.Client{}

	req, _ := http.NewRequest(method, serverAddress+"/api"+uri, bytes.NewBuffer([]byte(postData)))

	ts := strconv.FormatInt(time.Now().UnixNano()/1000, 10)
	
	if (method == "POST") {
		req.Header.Add("Content-Type", "application/json")
		//req.Header.Add("Content-Length", strconv.Itoa(len(data.Encode())))
	}

	enc := computeHmac1(ts,passwordHash);
	
	req.Header.Add("X-API-Login", login)
	req.Header.Add("X-API-Hash", enc)
	req.Header.Add("X-API-Time", ts)
	
	resp,err := client.Do(req)
	if (err != nil) {
		fmt.Println("Network error")
		os.Exit(1)
	}
	contents, _ := ioutil.ReadAll(resp.Body)
	
	var dat map[string]interface{}
    if err := json.Unmarshal(contents, &dat); err != nil {
        panic(err)
    }
    
    return dat
	
}

func computeHmac1(message string, secret string) string {
    key := []byte(secret)
    h := hmac.New(sha1.New, key)
    h.Write([]byte(message))
    hash := h.Sum(nil)
    return hex.EncodeToString(hash)
}

func computeSha1(str string) string {
	h := sha1.New()
	h.Write([]byte(str))
	hash := h.Sum(nil)
	return hex.EncodeToString(hash)
	
}
