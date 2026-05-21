#!/bin/bash

# Kill any existing instances to avoid conflicts
pkill xremap

# Run xremap with all specified devices
# Note: Using 'sudo' or 'uinput' group permissions is usually required for xremap
xremap --watch=device '~/.config/xremap/config.yml'
