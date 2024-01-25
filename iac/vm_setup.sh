#!/usr/bin/env bash
# Запуск плейбука первичной настройки виртуальной машины
DIRNAME='/usr/bin/dirname'
READLINK='/bin/readlink'
CURRENT_DIR=$($DIRNAME $($READLINK -e "$0"))
pushd $CURRENT_DIR 2>&1 > /dev/null

set -a
. ../.env

if [ $# -eq 1 ]; then
  ansible-playbook  -i "inventory.yaml" --tags $1 playbook.yaml
else
  ansible-playbook  -i "inventory.yaml" playbook.yaml
fi
