#!/usr/bin/env bats

load 'test_helper/bats-support/load'
load 'test_helper/bats-assert/load'
load test_helpers

IMAGE="bats-opbeans"
CONTAINER="opbeans-node"

@test "build image" {
	cd $BATS_TEST_DIRNAME/..
	run docker compose build
	assert_success
}

@test "create test container" {
	run docker compose up -d
	assert_success
}

@test "test container is running" {
	run docker inspect -f {{.State.Running}} $CONTAINER
	assert_output --partial 'true'
}

@test "opbeans is running in port ${PORT}" {
	sleep 50
	URL="http://127.0.0.1:$(docker port "$CONTAINER" ${PORT} | cut -d: -f2)"
	run curl -v --fail --connect-timeout 10 --max-time 30 "${URL}/"
	assert_success
	assert_output --partial 'HTTP/1.1 200'
}

@test "clean test containers" {
	run docker compose down
	assert_success
}
