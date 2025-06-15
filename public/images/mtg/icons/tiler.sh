#!/bin/bash

input="Mana-BW.png"
tile_w=100
tile_h=100
pad_inner=5

filenames=("0" "1" "2" "3" "4" "5" "6" "7" "8" "9" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "20" "x" "y" "z" "w" "u" "b" "r" "g" "s" "wu" "wb" "ub" "ur" "br" "bg" "rw" "rg" "gw" "gu" "2w" "2u" "2b" "2r" "2g" "wp" "up" "bp" "rp" "gp" "t" "q" "infinity" "half" "t-old" "t-old-2" "w-old")
filename_length=${#filenames[@]}

cols=10
rows=7

count=0

for ((y=0; y<rows; y++)); do
	for ((x=0; x<cols; x++)); do
		offset_x=$((x * (tile_w + pad_inner)))
		offset_y=$((y * (tile_h + pad_inner)))

		name="_$count"
		if [ $count -lt $filename_length ]; then
			name="${filenames[count]}"
		fi

		magick "$input" -crop "${tile_w}x${tile_h}+${offset_x}+${offset_y}" +repage "out/${name}.png"
		echo "$count"
		((count++))
	done
done

