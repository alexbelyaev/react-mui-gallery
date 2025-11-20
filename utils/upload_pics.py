#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import shutil
import argparse
from PIL import Image

# ------------------------------------------------------------
# ПАРАМЕТРЫ
# ------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIR_UPLOAD = os.path.join(BASE_DIR, "../upload_pics")
DIR_PICS = os.path.join(BASE_DIR, "../public/pic")
FILE_PRODUCTS = os.path.join(BASE_DIR, "../public/data/products.json")

PREVIEW_MAX_SIDE = 150   # px
IMAGE_MAX_SIDE = 500     # px
DEFAULT_CATEGORY = "1"   # category, если не задано аргументом

# ------------------------------------------------------------
# АРГУМЕНТЫ КОМАНДНОЙ СТРОКИ
# ------------------------------------------------------------
parser = argparse.ArgumentParser(description="Import and sync product images.")

parser.add_argument("--cat", type=str, help="Category for new images")
parser.add_argument("--author", type=str, help="Author for new images")
parser.add_argument("--price", type=str, help="Price for new images")
parser.add_argument("--description", type=str, help="Description for new images")
parser.add_argument("--rating", type=str, help="Rating for new images")

args = parser.parse_args()

# Значения по умолчанию только если не указаны аргументы
NEW_CAT = args.cat if args.cat else DEFAULT_CATEGORY
NEW_AUTHOR = args.author if args.author else ""
NEW_PRICE = args.price if args.price else ""
NEW_DESCRIPTION = args.description if args.description else None
NEW_RATING = args.rating if args.rating else ""

# ------------------------------------------------------------
# Проверяем директории
# ------------------------------------------------------------
for d in [DIR_UPLOAD, DIR_PICS, os.path.dirname(FILE_PRODUCTS)]:
    if not os.path.exists(d):
        print(f"Ошибка: директория '{d}' не существует.")
        exit(1)

# ------------------------------------------------------------
# Загружаем products.json
# ------------------------------------------------------------
if os.path.exists(FILE_PRODUCTS):
    try:
        with open(FILE_PRODUCTS, "r", encoding="utf-8") as f:
            products = json.load(f)
        if not isinstance(products, list):
            print("Ошибка: products.json имеет неправильный формат.")
            exit(1)
    except:
        products = []
else:
    products = []

# ------------------------------------------------------------
# Функции
# ------------------------------------------------------------

def resize_image(input_path, output_path, max_side):
    """
    Сжимает изображение пропорционально, чтобы большая сторона ≤ max_side
    """
    img = Image.open(input_path)
    w, h = img.size
    scale = max_side / max(w, h)
    if scale < 1:
        new_size = (int(w * scale), int(h * scale))
        img = img.resize(new_size, Image.LANCZOS)
    img.save(output_path, quality=90)
    return img.size   # возвращаем (w, h)

def ensure_preview(pic_path):
    """
    Проверяет наличие превью 000001s.jpg.
    Если нет — создает.
    """
    dirname, fname = os.path.split(pic_path)
    name, ext = os.path.splitext(fname)

    if not name.isdigit():
        return

    preview_name = f"{name}s{ext}"
    preview_path = os.path.join(dirname, preview_name)

    if os.path.exists(preview_path):
        return  # уже есть

    resize_image(pic_path, preview_path, PREVIEW_MAX_SIDE)


# ------------------------------------------------------------
# Собираем список реальных картинок 000001.jpg
# ------------------------------------------------------------
real_images = []
for fname in os.listdir(DIR_PICS):
    name, ext = os.path.splitext(fname)
    if ext.lower() == ".jpg" and name.isdigit() and not fname.endswith("s.jpg"):
        real_images.append(name)

real_images = sorted(real_images)

# ------------------------------------------------------------
# Актуализируем products: добавляем и удаляем записи
# ------------------------------------------------------------
products_dict = {p["photo_num"]: p for p in products}

# Удаляем записи, если файла нет
for num in list(products_dict.keys()):
    if num not in real_images:
        del products_dict[num]

# Добавляем записи, если файла нет в JSON
for num in real_images:
    if num not in products_dict:
        products_dict[num] = {
            "category": NEW_CAT,
            "photo_num": num,
            "name": "",
            "aughtor": NEW_AUTHOR,
            "size_w": "",
            "size_h": "",
            "price": NEW_PRICE,
            "description": NEW_DESCRIPTION,
            "rating": NEW_RATING,
            "sm_img_w": "",
            "sm_img_h": "",
        }

products = list(products_dict.values())
products.sort(key=lambda x: int(x["photo_num"]))

# ------------------------------------------------------------
# Находим максимальный photo_num
# ------------------------------------------------------------
max_num = 0
if products:
    max_num = max(int(p["photo_num"]) for p in products)

# ------------------------------------------------------------
# Проверяем наличие превью
# ------------------------------------------------------------
for num in real_images:
    img_path = os.path.join(DIR_PICS, f"{num}.jpg")
    ensure_preview(img_path)

# ------------------------------------------------------------
# Обрабатываем новые картинки из upload_pics
# ------------------------------------------------------------
upload_files = [f for f in os.listdir(DIR_UPLOAD)
                if f.lower().endswith((".jpg", ".jpeg", ".png"))]

for fname in upload_files:
    src_path = os.path.join(DIR_UPLOAD, fname)

    # новый номер
    max_num += 1
    new_num = f"{max_num:06d}"
    new_img = os.path.join(DIR_PICS, f"{new_num}.jpg")
    new_preview = os.path.join(DIR_PICS, f"{new_num}s.jpg")

    # уменьшаем до 500px и сохраняем jpg
    resize_image(src_path, new_img, IMAGE_MAX_SIDE)

    # создаём превью
    sm_w, sm_h = resize_image(src_path, new_preview, PREVIEW_MAX_SIDE)

    # добавляем в JSON
    products.append({
        "category": NEW_CAT,
        "photo_num": new_num,
        "name": "",
        "aughtor": NEW_AUTHOR,
        "size_w": "",
        "size_h": "",
        "price": NEW_PRICE,
        "description": NEW_DESCRIPTION,
        "rating": NEW_RATING,
        "sm_img_w": sm_w,
        "sm_img_h": sm_h,
    })

    # удаляем файл из upload
    os.remove(src_path)

# ------------------------------------------------------------
# Сохраняем products.json
# ------------------------------------------------------------
with open(FILE_PRODUCTS, "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("Готово.")
