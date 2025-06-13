package main

import (
	"log"
	"runtime"

	"github.com/BurntSushi/toml"
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/apiserver"
	_ "github.com/lib/pq"
)

func main() {

	max := runtime.GOMAXPROCS(0)
	log.Printf(">> runtime.GOMAXPROCS before set: %d\n", max)
	runtime.GOMAXPROCS(runtime.NumCPU())
	log.Printf(">> runtime.GOMAXPROCS after set: %d\n", runtime.GOMAXPROCS(0))
	config := apiserver.CreateConfig()
	_, err := toml.DecodeFile("D:/code/github.com/MeSTb3a3IIp/200vibes/src/server/config/apiserver.toml", config)
	if err != nil {
		log.Fatal(err)
	}
	if err := apiserver.Start(config); err != nil {
		log.Fatal(err)
	}
}
