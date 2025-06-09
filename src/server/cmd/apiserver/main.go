package main

import (
	"log"

	"github.com/BurntSushi/toml"
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/apiserver"
	_ "github.com/lib/pq"
)

func main() {

	config := apiserver.CreateConfig()
	_, err := toml.DecodeFile("D:/code/github.com/MeSTb3a3IIp/200vibes/src/server/config/apiserver.toml", config)
	if err != nil {
		log.Fatal(err)
	}
	if err := apiserver.Start(config); err != nil {
		log.Fatal(err)
	}
}
