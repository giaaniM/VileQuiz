# 🚀 Guida al Deployment su Render

Questa guida ti spiega come portare **VileQuiz** online in pochi minuti usando Render.com.

## Prerequisiti

1.  Un account [GitHub](https://github.com/) (dove hai caricato il progetto).
2.  Un account [Render](https://render.com/).
3.  Un account [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (per il database gratuito).
4.  La tua **API Key di Groq**.

---

## 1. Setup Database (MongoDB Atlas)

Render non offre MongoDB nativo, quindi usiamo il piano gratuito di Atlas.

1.  Registrati su [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Crea un **New Cluster** (scegli il piano **M0 Free**).
3.  Vai su **Database Access** > "Add New Database User":
    *   Username: `admin`
    *   Password: *(generane una sicura e copiala)*
4.  Vai su **Network Access** > "Add IP Address":
    *   Seleziona "Allow Access from Anywhere" (`0.0.0.0/0`).
5.  Vai su **Database** > "Connect" > "Drivers":
    *   Copia la stringa di connessione (es. `mongodb+srv://admin:<password>@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority`).
    *   Sostituisci `<password>` con la password creata al punto 3.

---

## 2. Deploy Automatico su Render

Il progetto include già un file `render.yaml` che configura tutto (Server Node, Redis, Build Frontend).

1.  Vai sulla **Dashboard di Render**.
2.  Clicca su **New +** e seleziona **Blueprint**.
3.  Collega il tuo repository GitHub (`giaaniM/VileQuiz`).
4.  Dai un nome al servizio (es. `vilequiz-app`).
5.  Render ti chiederà di inserire le **Environment Variables**:

| Chiave | Valore |
| :--- | :--- |
| `GROQ_API_KEY` | Incolla la tua chiave API di Groq (`gsk_...`) |
| `MONGODB_URI` | Incolla la stringa di connessione di MongoDB Atlas |

6.  Clicca su **Apply**.

---

## 3. Fatto! 🎉

Render farà tutto da solo:
1.  Installerà le dipendenze.
2.  Costruirà il frontend React.
3.  Avvierà il server e Redis.

Una volta finito (ci vorranno circa 3-5 minuti), ti darà un URL (es. `https://vilequiz.onrender.com`).
Apri quel link e gioca!
