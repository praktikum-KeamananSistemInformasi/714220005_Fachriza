from flask import Flask, render_template, request, jsonify
from Crypto.Cipher import AES, DES, DES3, Blowfish, ARC4
from Crypto.Util.Padding import pad, unpad
import base64

app = Flask(__name__)

def encrypt_data(algorithm, text, key):
    if algorithm == 'aes':
        cipher = AES.new(pad(key.encode(), AES.block_size), AES.MODE_CBC)
        ct_bytes = cipher.encrypt(pad(text.encode(), AES.block_size))
        result = base64.b64encode(cipher.iv + ct_bytes).decode('utf-8')
    elif algorithm == 'des':
        cipher = DES.new(pad(key.encode(), DES.block_size), DES.MODE_CBC)
        ct_bytes = cipher.encrypt(pad(text.encode(), DES.block_size))
        result = base64.b64encode(cipher.iv + ct_bytes).decode('utf-8')
    elif algorithm == '3des':
        cipher = DES3.new(pad(key.encode(), DES3.block_size), DES3.MODE_CBC)
        ct_bytes = cipher.encrypt(pad(text.encode(), DES3.block_size))
        result = base64.b64encode(cipher.iv + ct_bytes).decode('utf-8')
    elif algorithm == 'blowfish':
        cipher = Blowfish.new(pad(key.encode(), Blowfish.block_size), Blowfish.MODE_CBC)
        ct_bytes = cipher.encrypt(pad(text.encode(), Blowfish.block_size))
        result = base64.b64encode(cipher.iv + ct_bytes).decode('utf-8')
    elif algorithm == 'rc4':
        cipher = ARC4.new(key.encode())
        ct_bytes = cipher.encrypt(text.encode())
        result = base64.b64encode(ct_bytes).decode('utf-8')
    return result

def decrypt_data(algorithm, enc_text, key):
    enc_bytes = base64.b64decode(enc_text)
    if algorithm == 'aes':
        iv = enc_bytes[:16]
        cipher = AES.new(pad(key.encode(), AES.block_size), AES.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(enc_bytes[16:]), AES.block_size)
    elif algorithm == 'des':
        iv = enc_bytes[:8]
        cipher = DES.new(pad(key.encode(), DES.block_size), DES.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(enc_bytes[8:]), DES.block_size)
    elif algorithm == '3des':
        iv = enc_bytes[:8]
        cipher = DES3.new(pad(key.encode(), DES3.block_size), DES3.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(enc_bytes[8:]), DES3.block_size)
    elif algorithm == 'blowfish':
        iv = enc_bytes[:8]
        cipher = Blowfish.new(pad(key.encode(), Blowfish.block_size), Blowfish.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(enc_bytes[8:]), Blowfish.block_size)
    elif algorithm == 'rc4':
        cipher = ARC4.new(key.encode())
        pt = cipher.decrypt(enc_bytes)
    return pt.decode('utf-8')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/crypto', methods=['POST'])
def crypto():
    text = request.form['text']
    key = request.form['key']
    algorithm = request.form['algorithm']
    action = request.form['action']

    if action == 'encrypt':
        result = encrypt_data(algorithm, text, key)
        explanation = get_explanation(algorithm, action)
    elif action == 'decrypt':
        result = decrypt_data(algorithm, text, key)
        explanation = get_explanation(algorithm, action)

    return jsonify({'result': result, 'explanation': explanation})

def get_explanation(algorithm, action):
    explanations = {
        'aes': {
            'description': "AES adalah algoritma enkripsi simetris yang menggunakan blok data berukuran 128-bit, dengan ukuran kunci yang bervariasi (128, 192, atau 256-bit).",
            'steps': [
                "1. Key Expansion: Kunci awal diubah menjadi beberapa kunci bundar (round keys).",
                "2. Initial Round: Blok plaintext digabungkan dengan kunci bundar pertama menggunakan operasi XOR.",
                "3. Ronde Utama: Meliputi langkah-langkah SubBytes, ShiftRows, MixColumns, dan AddRoundKey.",
                "4. Final Round: Langkah-langkah yang sama, tetapi tanpa MixColumns."
            ]
        },
        'des': {
            'description': "DES adalah algoritma enkripsi blok yang menggunakan blok 64-bit dan kunci 56-bit.",
            'steps': [
                "1. Initial Permutation (IP): Blok data diacak menggunakan tabel permutasi awal.",
                "2. Expansion: Setiap setengah blok diperluas dari 32-bit menjadi 48-bit.",
                "3. Key Mixing: Blok diperluas di-XOR dengan kunci bundar.",
                "4. Substitution: Blok hasil di-XOR dimasukkan ke tabel substitusi (S-box).",
                "5. Permutation: Blok yang dihasilkan dari S-box dipermutasikan.",
                "6. Final Permutation: Hasil akhir diacak kembali."
            ]
        },
        '3des': {
            'description': "3DES adalah pengembangan dari DES yang menerapkan algoritma DES tiga kali pada setiap blok data.",
            'steps': [
                "1. Kunci dibagi menjadi tiga kunci DES yang berbeda.",
                "2. Enkripsi dengan kunci pertama.",
                "3. Dekripsi dengan kunci kedua.",
                "4. Enkripsi dengan kunci ketiga."
            ]
        },
        'blowfish': {
            'description': "Blowfish adalah algoritma enkripsi simetris dengan ukuran blok 64-bit dan kunci hingga 448-bit.",
            'steps': [
                "1. Kunci diubah menjadi 4168 byte menggunakan tabel substitusi.",
                "2. Blok dibagi menjadi dua bagian 32-bit.",
                "3. Setiap bagian di-XOR dengan kunci yang relevan dan diproses melalui tabel substitusi."
            ]
        },
        'rc4': {
            'description': "RC4 adalah algoritma enkripsi stream yang menggunakan kunci dari 1 hingga 256 byte.",
            'steps': [
                "1. Inisialisasi vektor kunci menggunakan kunci yang diberikan.",
                "2. Menghasilkan stream kunci menggunakan vektor kunci.",
                "3. Menggunakan stream kunci untuk mengenkripsi atau mendekripsi plaintext."
            ]
        },
    }

    return explanations.get(algorithm, {'description': '', 'steps': []})

if __name__ == '__main__':
    app.run(debug=True)
