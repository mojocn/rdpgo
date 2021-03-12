package guac

import (
	"testing"
	"time"
)

func TestCountedLock_HasQueued(t *testing.T) {
	lock := CountedLock{}

	if lock.HasQueued() {
		t.Error("Expected false got true (1)")
	}

	lock.Lock()

	if lock.HasQueued() {
		t.Error("Expected false got true (2)")
	}

	go func() {
		lock.Lock()
	}()

	// ensure the goroutine above runs
	time.Sleep(time.Millisecond)

	if !lock.HasQueued() {
		t.Error("Expected true got false")
	}

	lock.Unlock()

	if lock.HasQueued() {
		t.Error("Expected false got true (3)")
	}

	// ensure the lock is taken in the goroutine
	time.Sleep(time.Millisecond)

	lock.Unlock()

	if lock.HasQueued() {
		t.Error("Expected false got true (4)")
	}
}
