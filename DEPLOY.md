# 🚀 Guida al Deployment su Render (No Database)

Questa guida ti spiega come portare **VileQuiz** online in pochi minuti su Render.com, **senza configurare database esterni**. Il gioco funzionerà esattamente come sul tuo PC, usando la memoria temporanea del server.

## Prerequisiti

1.  Un account [GitHub](https://github.com/) (dove hai caricato il progetto).
2.  Un account [Render](https://render.com/).
3.  La tua **API Key di Groq**.

---

## Deploy Automatico su Render

Il progetto è configurato per funzionare "out of the box".

1.  Vai sulla **Dashboard di Render**.
2.  Clicca su **New +** e seleziona **Blueprint**.
3.  Collega il tuo repository GitHub (`giaaniM/VileQuiz`).
4.  Dai un nome al servizio (es. `vilequiz-app`).
5.  Render ti chiederà **una sola** variabile:

| Chiave | Valore |
| :--- | :--- |
| `GROQ_API_KEY` | Incolla la tua chiave API di Groq (`gsk_...`) |

6.  Clicca su **Apply**.

---

## Fatto! 🎉

Render farà tutto da solo:
1.  Costruirà il server e il client.
2.  Avvierà Redis (incluso gratuitamente nel blueprint).
3.  Serverà il gioco.

In 3-5 minuti avrai il tuo link (es. `https://vilequiz.onrender.com`).
Apri quel link, crea una partita e condividi il QR code con gli amici!
