import json
import os
import time

import requests

IMAGES_FOLDER = "../images/index/carousel/mtg/actual"
DATA_FOLDER = "../data/index"
IMAGES_URL_FILE = "../../src/lib/index/carouselLinks.ts"


def test_directories() -> bool:
	print(f"=== Image Folder contents ===\n{os.listdir(IMAGES_FOLDER)}")
	print(f"=== Data Folder contents ===\n{os.listdir(DATA_FOLDER)}")
	with open(IMAGES_URL_FILE) as file:
		print(f"=== URLs File contents ===\n{file.read()}")
	return input("\nIs this information correct? [y/N] ") == "y"


def get_card_names() -> list[str]:
	ret_arr = []
	print("Input your card names, one at a time (blank input to stop):")
	while True:
		i = input()
		if i == "":
			break
		ret_arr.append(i)

	return ret_arr


# Downloads an image from a URL and saves it to IMAGES_FOLDER
def download_card_from_url(url: str, save_file: str) -> None:
	response = requests.get(url,
	                        headers={"User-Agent": "Simplified-Proxies-Bot/1.0", "Accept": "*.jpg"})
	if not response.ok:
		print(response.content)
		raise Exception(f"Can't fetch image with url {url}")
	data = response.content
	with open(os.path.join(IMAGES_FOLDER, save_file), "wb") as file:
		file.write(data)


# Downloads images and writes to IMAGES_FOLDER. Returns a list of saved paths
def download_card_images(card_names: list[str]) -> list[str]:
	ret_arr = []
	for idx, card in enumerate(card_names):
		print(f"Fetching card {idx + 1} out of {len(card_names)}")
		response = requests.get(f"https://api.scryfall.com/cards/named?fuzzy={card}",
		                        headers={"User-Agent": "Simplified-Proxies-Bot/1.0", "Accept": "application/json"})
		if not response.ok:
			raise Exception("Scryfall errored")

		res_json = response.json()
		image_link = res_json["image_uris"]["normal"]

		save_path_no_suffix = card.replace(" ", "-")
		download_card_from_url(image_link, f"{save_path_no_suffix}.jpg")
		ret_arr.append(save_path_no_suffix)

		time.sleep(1)

	return ret_arr


# fetches from API
def get_card_data(card_list: list[str], save_file: str) -> None:
	card_data = "\n".join(card_list)
	response = requests.post(f"https://simplified-proxies.mm4096.com/api/import/mtg",
	                         data=json.dumps({
								 "cards": card_data,
								 "flavorTextBehavior": 0,
								 "importBasicLands": False,
								 "importNote": "",
								 "importTemplates": True,
								 "reminderTextBehavior": 1,
								 "splitDFCs": False,
							 }))
	if not response.ok:
		print(card_data)
		print(response.content)
		print(response.status_code)
		raise Exception("Couldn't get card data from Simplified Proxies!")

	res_data = json.dumps(response.json()["cards"])
	with open(os.path.join(DATA_FOLDER, save_file), "w") as file:
		file.write(res_data)


if __name__ == "__main__":
	if not test_directories():
		exit(0)
	print("Input left column cards")
	left_column_cards = get_card_names()
	print("Input right column cards")
	right_column_cards = get_card_names()

	left_save = download_card_images(left_column_cards)
	right_save = download_card_images(right_column_cards)

	get_card_data(left_column_cards, "carousel-left.json")
	get_card_data(right_column_cards, "carousel-right.json")

	with open(IMAGES_URL_FILE, "w") as file:
		file.write(f'''
export const carouselLinksLeft: string[] = {json.dumps(left_save)};
export const carouselLinksRight: string[] = {json.dumps(right_save)};''')