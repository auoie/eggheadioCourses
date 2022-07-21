package main

import (
	"fmt"
	"os/exec"
	"time"
)

func action() {
	cmd := exec.Command("npx", "nx", "run", "frontend-tailwind:export")
	fmt.Println(fmt.Sprint(time.Now().UTC().Format(time.RFC3339), ": Running command"))
	output, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(output))
	cmd = exec.Command("rsync", "-avzh", "--delete", "dist/apps/frontend-tailwind/exported/", "output/")
	output, err = cmd.Output()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(output))
}

func main() {
	periodicTimer := time.NewTicker(24 * time.Hour)
	action()
	for range periodicTimer.C {
		action()
	}
}
