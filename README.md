# Adonis administrace uživatelů

Jednoduchá správa uživatelů v [AdonisJS](https://adonisjs.com) s databází SQLite.

Dojmy z práce s frameworkem a srovnání s Laravelem jsou v [DOKUMENTACE.md](DOKUMENTACE.md).

## Co aplikace umí

- registrace a přihlášení (ze starter kitu AdonisJS)
- role **admin** a **uživatel**
- administrace uživatelů na `/admin/users` (jen pro adminy):
  - seznam uživatelů
  - přidání uživatele
  - úprava jména, e-mailu, hesla a role
  - smazání uživatele
- admin nemůže smazat sám sebe ani si odebrat roli admina, takže v aplikaci vždy zůstane aspoň jeden

## Spuštění

Potřeba je Node.js 24 nebo novější.

```bash
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
node ace db:seed
npm run dev
```

Aplikace poběží na http://localhost:3333.

Seeder vytvoří tyto účty:

| E-mail                      | Heslo     | Role     |
| --------------------------- | --------- | -------- |
| admin@example.com           | admin1234 | admin    |
| jan.novak@example.com       | heslo1234 | uživatel |
| petra.svobodova@example.com | heslo1234 | uživatel |

Databáze je soubor `tmp/db.sqlite3`.

## Důležité soubory

| Soubor                                                 | Co dělá                                   |
| ------------------------------------------------------ | ----------------------------------------- |
| `database/migrations/*_add_role_to_users_table.ts`     | přidá sloupec `role` do tabulky `users`   |
| `database/seeders/user_seeder.ts`                      | výchozí admin a ukázkoví uživatelé        |
| `app/models/user.ts`                                   | model uživatele, getter `isAdmin`         |
| `app/middleware/admin_middleware.ts`                   | pustí dál jen adminy, ostatním vrátí 403  |
| `app/validators/user.ts`                               | validace formulářů (VineJS)               |
| `app/controllers/admin/users_controller.ts`            | akce seznam, vytvoření, úprava, smazání   |
| `start/routes.ts`                                      | routy `/admin/users` chráněné middlewarem |
| `resources/views/pages/admin/users/*.edge`             | šablony administrace                      |
| `resources/views/partials/admin/user_form.edge`        | společný formulář pro přidání a úpravu    |

## Poznámka k Windows

Pokud `node ace` spadne s chybou `Failed to load native binding`, kompilátor SWC
nemůže zapisovat svou cache. Pomůže nastavit proměnnou prostředí
`SWC_NATIVE_BINDING_CACHE` na složku, kam má zápis jen váš účet (např. `C:\swc-cache`),
a restartovat terminál.
