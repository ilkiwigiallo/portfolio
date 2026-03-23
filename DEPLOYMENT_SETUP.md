# Documentazione Setup Deploy Automatico & README Update

Questo documento descrive la configurazione implementata per automatizzare il deploy su Vercel e l'aggiornamento dinamico delle novità nel file `README.md`.

---

## 1. Cosa è stato configurato

### A. GitHub Action (`.github/workflows/deploy.yml`)
È il "motore" che gestisce l'automazione. Si attiva ad ogni `push` sui branch `main` o `master`.
1. **Deploy**: Invia il codice a Vercel usando i token di sicurezza.
2. **Aggiornamento README**: 
   - Estrae il messaggio dell'ultimo commit (es. `feat: aggiunta galleria`).
   - Cerca la sezione `## 🆕 Novità` nel `README.md`.
   - Inserisce la data odierna e il messaggio del commit.
   - Effettua un commit automatico con il prefisso `[skip ci]`.

### B. Protezione Loop su Vercel ("Ignored Build Step")
Per evitare che Vercel faccia un secondo deploy ogni volta che il bot aggiorna il README, abbiamo impostato una regola personalizzata su Vercel (**Settings > Build & Development > Ignored Build Step**):
- **Comando**: `git log -1 --pretty=%s | grep -q "\[skip ci\]" && exit 0 || exit 1`
- **Funzionamento**: Se il commit contiene `[skip ci]`, Vercel ignora il deploy.

---

## 2. Requisiti (GitHub Secrets)
Per funzionare, il repository GitHub deve avere questi 3 Secret impostati:
1. `VERCEL_TOKEN`: Token personale generato su Vercel.
2. `VERCEL_ORG_ID`: ID del tuo account/team Vercel.
3. `VERCEL_PROJECT_ID`: ID specifico del progetto Vercel.

---

## 3. Come modificare il comportamento

### Cambiare il formato della data o del messaggio
Modifica il file `.github/workflows/deploy.yml` nella sezione `run` dello step `Update README with News`.
- Per la data: cambia `date +'%d/%m/%Y %H:%M'`.
- Per il messaggio: il valore è contenuto nella variabile `LAST_COMMIT_MSG`.

### Cambiare il numero di news mostrate
Attualmente il codice sostituisce l'intera sezione `## 🆕 Novità` mantenendo solo l'ultima. Se vuoi uno storico più lungo, dovresti modificare lo script `sed` nel file `.yml`.

---

## 4. Come ripristinare (Revert)

Se vuoi tornare alla situazione precedente:
1. **Rimuovi l'automazione**: Elimina il file `.github/workflows/deploy.yml`.
2. **Ripristina Vercel**: In **Settings > Build & Development** su Vercel, imposta **Ignored Build Step** su "None" o "Default".
3. **Pulisci il README**: Rimuovi la sezione `## 🆕 Novità` dal file `README.md`.

---

## 5. Convenzioni Consigliate
Il sistema è ottimizzato per i **Conventional Commits**. Usando prefissi come `feat:`, `fix:`, `docs:`, le tue novità nel README saranno sempre chiare e ordinate.

*Esempio:* `git commit -m "feat: aggiunta animazione 3D alla hero"` -> Nel README apparirà come novità.
