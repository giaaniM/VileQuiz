# 🚀 Guida al Deployment su Render (Configurazione ZERO)

Questa guida ti spiega come portare **VileQuiz** online in pochi minuti su Render.com.

È tutto **AUTOMATICO** e **PRE-CONFIGURATO**. Non devi fare nulla se non cliccare "Apply".

## Prerequisiti

1.  Un account [GitHub](https://github.com/) (dove hai caricato il progetto).
2.  Un account [Render](https://render.com/).

---

## Deploy Automatico

Il progetto ha già tutti i segreti e le configurazioni incluse (Chiave API, Database simulato, Redis gratuito).

1.  Vai sulla [Dashboard di Render](https://dashboard.render.com/).
2.  Clicca su **New +** e seleziona **Blueprint**.
3.  Collega il tuo repository GitHub (`giaaniM/VileQuiz`).
4.  Dai un nome al servizio (es. `vilequiz-app`).
5.  Clicca su **Apply**.

---

## Fatto! 🎉

Render farà tutto da solo:
1.  Costruirà il server e il client.
2.  Avvierà Redis.
3.  Serverà il gioco.

In 3-5 minuti avrai il tuo link (es. `https://vilequiz.onrender.com`).
Apri quel link, crea una partita e divertiti!
