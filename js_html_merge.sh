#!/bin/sh



#! /bin/bash  

if [ ! "$#" -eq 2 ]; then
    echo "$0 jsfile htmlfile"
    exit
fi


sed -n '50,100000p' "$1" > dump1


cat dump1 | sed 's/"/\\"/g' >dump2
#cat dump | awk  '{print "OpenWindow.document.write( \"" $0 "<br>\" );" }'>dump1
cat dump2 | awk  '{print "OpenWindow.document.write( \"" $0 "\\n\" );" }'>dump3



lno=$(grep "function write_file(){" "$2"  -n| awk -F":" '{print $1}')
head -"$lno" "$2" >iPhone.html
cat dump3 >>iPhone.html
echo '}</SCRIPT></html>' >>iPhone.html



rm dump*