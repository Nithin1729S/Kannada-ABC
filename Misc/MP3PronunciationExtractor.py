from gtts import gTTS

def download_pronunciation_gTTS(letter, language='kn', output_file='output_gtts.mp3'):
    tts = gTTS(text=letter, lang=language)
    tts.save(output_file)
    print(f"Downloaded pronunciation as {output_file}")

# List of tuples containing the numeral and the corresponding Kannada letter
alphabet_list = [
    (1, 'ಅ'),
    (2, 'ಆ'),
    (3, 'ಇ'),
    (4, 'ಈ'),
    (5, 'ಉ'),
    (6, 'ಊ'),
    (7, 'ಋ'),
    (8, 'ಎ'),
    (9, 'ಏ'),
    (10, 'ಐ'),
    (11, 'ಒ'),
    (12, 'ಓ'),
    (13, 'ಔ'),
    (14, 'ಅಂ'),
    (15, 'ಅಃ'),
    (16, 'ಕ'),
    (17, 'ಖ'),
    (18, 'ಗ'),
    (19, 'ಘ'),
    (20, 'ಙ'),
    (21, 'ಚ'),
    (22, 'ಛ'),
    (23, 'ಜ'),
    (24, 'ಝ'),
    (25, 'ಞ'),
    (26, 'ಟ'),
    (27, 'ಠ'),
    (28, 'ಡ'),
    (29, 'ಢ'),
    (30, 'ಣ'),
    (31, 'ತ'),
    (32, 'ಥ'),
    (33, 'ದ'),
    (34, 'ಧ'),
    (35, 'ನ'),
    (36, 'ಪ'),
    (37, 'ಫ'),
    (38, 'ಬ'),
    (39, 'ಭ'),
    (40, 'ಮ'),
    (41, 'ಯ'),
    (42, 'ರ'),
    (43, 'ಲ'),
    (44, 'ವ'),
    (45, 'ಶ'),
    (46, 'ಷ'),
    (47, 'ಸ'),
    (48, 'ಹ'),
    (49, 'ಳ'),
]

# Loop through each letter and generate its audio file
for numeral, letter in alphabet_list:
    output_file = f"{numeral}.mp3"
    download_pronunciation_gTTS(letter, language='kn', output_file=output_file)
