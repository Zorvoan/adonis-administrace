# AdonisJS: dojmy z práce, pro a proti, srovnání s Laravelem

## Zadání

Vytvořit funkční administraci uživatelů v AdonisJS s databází SQLite, verzovat kód v Gitu
a sepsat dojmy z frameworku. Použitá verze: **AdonisJS 7** (`@adonisjs/core` 7.x,
Lucid ORM 22, Edge 6, VineJS 4) na Node.js 24.

## Co jsem udělal

1. Projekt jsem založil přes `npm init adonisjs@latest` se starter kitem „web“
   (server-side šablony Edge, session přihlášení, SQLite).
2. Migrací jsem přidal do tabulky `users` sloupec `role` (`admin` / `user`).
3. Vytvořil jsem middleware `admin`, který pustí do administrace jen adminy.
4. Napsal jsem resource controller `admin/users_controller.ts` s akcemi
   `index`, `create`, `store`, `edit`, `update` a `destroy`.
5. Validaci formulářů řeší VineJS, například kontrolu, že e-mail ještě nikdo nemá.
6. Šablony jsem napsal v Edge a použil komponenty, které starter kit už obsahuje
   (formulář, pole, tlačítka).
7. Seeder vytváří výchozího admina, aby se dalo hned přihlásit.

Celá administrace má zhruba 300 řádků kódu včetně šablon.

## Dojmy

AdonisJS na mě působí jako „Laravel pro TypeScript“. Struktura složek, CLI nástroj
`node ace`, migrace, seedery, middleware, pojmenované routy i resource controllery
fungují skoro stejně jako v Laravelu. Kdo zná Laravel, zorientuje se rychle.

Nejvíc mě potěšilo, jak je všechno **typované**. Když v controlleru zavolám
`request.validateUsing(validator)`, výsledek má přesné typy podle validátoru.
Model `User` dědí z třídy `UserSchema`, kterou Lucid **sám vygeneruje z databáze**
po každé migraci. Po přidání sloupce `role` jsem ho tedy nemusel ručně dopisovat do
modelu a editor hned věděl, že `user.role` je `'admin' | 'user'`. Řadu chyb tak
odhalí TypeScript ještě před spuštěním (`npm run typecheck`).

Méně příjemný byl začátek. Na Windows mi `node ace` padal s chybou
`Failed to load native binding`. Kompilátor SWC, který Adonis používá ke spouštění
TypeScriptu, odmítal ukládat svou cache do složky s nestandardními oprávněními.
Pomohlo nastavit proměnnou prostředí `SWC_NATIVE_BINDING_CACHE`, ale přijít na to
chvíli trvalo. Chybová hláška k řešení nijak nenavádí.

Další drobnost: HTML formuláře umí jen GET a POST, takže úprava (PUT) a mazání
(DELETE) potřebují „method spoofing“ (`?_method=PUT`). Adonis to řeší sám přes
helper `formAttributes`, pokud ho člověk použije. Je to ale potřeba vědět, stejně
jako v Laravelu `@method('PUT')`.

Komunita a počet návodů jsou výrazně menší než u Laravelu. Na řadu otázek najdete
odpověď jen v oficiální dokumentaci. Ta je naštěstí kvalitní, ale některé návody
na internetu jsou pro starší verze (v5, v6) a už nefungují.

## Pro a proti

### Pro

- **TypeScript všude.** Typy fungují v modelech, validaci, routách i konfiguraci.
- **Všechno potřebné je součástí frameworku**: ORM, migrace, validace, autentizace,
  sessions, CSRF ochrana, šablony a testy. Nemusí se skládat z desítek knihoven
  jako u Express.js.
- **Konzistentní a oficiálně udržované balíčky.** Všechny `@adonisjs/*` balíčky
  vyvíjí jeden tým, takže k sobě sedí.
- **Generované typy modelů z databáze.** Model se nemusí ručně synchronizovat
  s migracemi.
- **Rychlý vývoj díky HMR.** Po uložení controlleru se změna projeví bez restartu
  serveru.
- **Jeden jazyk na frontendu i backendu.** Celá aplikace je v JavaScriptu nebo
  TypeScriptu.
- **Starter kit** obsahuje hotové přihlášení, registraci a sadu UI komponent.

### Proti

- **Malá komunita.** Je méně tutoriálů, odpovědí na Stack Overflow a hotových balíčků.
- **Žádný hotový admin panel.** Laravel má Filament nebo Nova, které vygenerují
  administraci z modelu. V Adonisu je potřeba vše napsat ručně.
- **Rychlé změny mezi verzemi.** Návody pro starší verze často nefungují.
- **Problémy s nativními závislostmi na Windows** (SWC, `better-sqlite3`).
- **Hostingu je méně.** Node.js aplikace potřebuje server, kde poběží proces.
  Levný sdílený PHP hosting nestačí.
- **Edge šablony** jsou méně známé než Blade, takže editory pro ně mají horší podporu.

## Srovnání s Laravelem

| Oblast             | AdonisJS                               | Laravel                                   |
| ------------------ | -------------------------------------- | ----------------------------------------- |
| Jazyk              | TypeScript / Node.js                   | PHP                                       |
| CLI                | `node ace`                             | `php artisan`                             |
| ORM                | Lucid (Active Record, nad Knex.js)     | Eloquent (Active Record)                  |
| Šablony            | Edge                                   | Blade                                     |
| Validace           | VineJS, výsledek je typovaný           | Validator / Form Request, pravidla v textu |
| Autentizace        | `@adonisjs/auth` (session, tokeny)     | Breeze, Jetstream, Fortify, Sanctum       |
| Admin panel        | nic oficiálního, psát ručně            | Filament, Nova, Backpack                  |
| Typová kontrola    | ano, kompilátor TypeScriptu            | jen přes PHPStan / Larastan               |
| Velikost komunity  | malá                                   | obrovská                                  |
| Hosting            | Node.js server                         | i levný sdílený PHP hosting               |

Ukázka, jak podobně vypadá kód. Routa pro administraci uživatelů:

```ts
// AdonisJS - start/routes.ts
router
  .group(() => {
    router.resource('users', controllers.admin.Users).except(['show'])
  })
  .prefix('admin')
  .as('admin')
  .use([middleware.auth(), middleware.admin()])
```

```php
// Laravel - routes/web.php
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
    });
```

Rozdíl je hlavně v syntaxi jazyka. Princip je stejný.

**Srovnání s Express.js / NestJS:** Express je minimalistický a ORM, validaci
i přihlašování si člověk skládá sám. NestJS je strukturovaný, ale zaměřený hlavně
na API a postavený na dekorátorech a modulech jako Angular. AdonisJS je mezi nimi:
dává hotovou strukturu jako Laravel, ale pro Node.js a s klasickými
server-renderovanými stránkami.

## Závěr

AdonisJS se mi pro tento typ úlohy líbil. Za pár hodin vznikla funkční a typově
bezpečná administrace a kód je čistý a přehledný. Pro někoho, kdo zná Laravel
a chce psát v TypeScriptu, je to velmi dobrá volba.

Pro rychlou administraci nad databází bych ale stále sáhl po Laravelu s Filamentem,
kde je stejná správa uživatelů hotová za pár minut a k dispozici je mnohem větší
ekosystém. AdonisJS dává smysl hlavně tam, kde tým už píše v JavaScriptu
nebo TypeScriptu a chce jeden jazyk pro celý projekt.
