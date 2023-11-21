#!/bin/bash

(cd server || exit; ./deploy.sh)
(cd client || exit; ./deploy.sh)
