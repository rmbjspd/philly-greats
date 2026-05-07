import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

async function set(date, letter, firstName) {
  const { data: puzzle } = await supabase
    .from('puzzles').select('id').eq('puzzle_date', date).single()
  if (!puzzle) { console.error(`no puzzle for ${date}`); return }
  const { error } = await supabase
    .from('puzzle_clues')
    .update({ first_name: firstName })
    .eq('puzzle_id', puzzle.id)
    .eq('acrostic_letter', letter)
  if (error) { console.error(`${date} [${letter}]:`, error.message); return }
  console.log(`✓ ${date} [${letter}] ${firstName}`)
}

// 2026-05-06
await set('2026-05-06', 'B', 'Donovan')   // MCNABB
await set('2026-05-06', 'A', 'Roy')        // HALLADAY
await set('2026-05-06', 'R', 'Bobby')      // ABREU
await set('2026-05-06', 'G', 'Andre')      // IGUODALA

// 2026-05-07
await set('2026-05-07', 'B', 'Andrew')     // BYNUM
await set('2026-05-07', 'A', 'Marcus')     // WATKINS
await set('2026-05-07', 'R', 'Danny')      // BRIERE
await set('2026-05-07', 'G', 'Claude')     // GIROUX

// 2026-05-08
await set('2026-05-08', 'B', 'Brian')      // BOUCHER
await set('2026-05-08', 'A', 'Mike')       // MAMULA
await set('2026-05-08', 'R', 'Mickey')     // MORANDINI
await set('2026-05-08', 'G', 'Doug')       // GLANVILLE

// 2026-05-09
await set('2026-05-09', 'B', 'Donald')     // BRASHEAR
await set('2026-05-09', 'A', 'Charlie')    // HAYES
await set('2026-05-09', 'R', 'Peter')      // FORSBERG
await set('2026-05-09', 'G', 'Brandon')    // INGE

// 2026-05-10
await set('2026-05-10', 'B', 'Eric')       // BRUNTLETT
await set('2026-05-10', 'A', 'Theo')       // RATLIFF
await set('2026-05-10', 'R', 'J.A.')       // DURBIN
await set('2026-05-10', 'G', 'Wendell')    // MAGEE

// 2026-05-11
await set('2026-05-11', 'B', 'Pat')        // BURRELL
await set('2026-05-11', 'A', 'Cole')       // HAMELS
await set('2026-05-11', 'R', 'Allen')      // IVERSON
await set('2026-05-11', 'G', 'Corey')      // GRAHAM (Eagles CB 2008-11)

// 2026-05-12
await set('2026-05-12', 'B', 'Hank')       // BASKETT
await set('2026-05-12', 'A', 'Brian')      // DAWKINS
await set('2026-05-12', 'R', 'Jimmy')      // ROLLINS
await set('2026-05-12', 'G', 'Brad')       // LIDGE

// 2026-05-13
await set('2026-05-13', 'B', 'Brian')      // WESTBROOK
await set('2026-05-13', 'A', 'Ryan')       // HOWARD
await set('2026-05-13', 'R', 'Doc')        // RIVERS
await set('2026-05-13', 'G', 'Billy')      // WAGNER

// 2026-05-14
await set('2026-05-14', 'B', 'Bill')       // BARBER
await set('2026-05-14', 'A', 'Raul')       // IBANEZ
await set('2026-05-14', 'R', 'Pete')       // ROSE
await set('2026-05-14', 'G', 'Simon')      // GAGNE

// 2026-05-15
await set('2026-05-15', 'B', 'Jeff')       // BLAKE
await set('2026-05-15', 'A', 'Jeff')       // THOMASON
await set('2026-05-15', 'R', 'Robert')     // PERSON
await set('2026-05-15', 'G', 'Hal')        // GREER

// 2026-05-16
await set('2026-05-16', 'B', 'Fred')       // BARNETT
await set('2026-05-16', 'A', 'Vicente')    // PADILLA
await set('2026-05-16', 'R', 'J.C.')       // ROMERO
await set('2026-05-16', 'G', "La'Roi")     // GLOVER

// 2026-05-17
await set('2026-05-17', 'B', 'Kim')        // BATISTE
await set('2026-05-17', 'A', 'Keith')      // VANHORN
await set('2026-05-17', 'R', 'Tom')        // MARSH
await set('2026-05-17', 'G', 'Alexandre')  // DAIGLE

// 2026-05-18
await set('2026-05-18', 'B', 'Joel')       // EMBIID
await set('2026-05-18', 'A', 'Darren')     // DAULTON
await set('2026-05-18', 'R', 'John')       // KRUK
await set('2026-05-18', 'G', 'Dallas')     // GOEDERT

// 2026-05-19
await set('2026-05-19', 'B', 'Shawn')      // BRADLEY
await set('2026-05-19', 'A', 'Tyrese')     // MAXEY
await set('2026-05-19', 'R', 'Zach')       // ERTZ
await set('2026-05-19', 'G', 'Eddie')      // GEORGE

// 2026-05-20
await set('2026-05-20', 'B', 'Joe')        // BLANTON
await set('2026-05-20', 'A', 'DeSean')     // JACKSON
await set('2026-05-20', 'R', 'Mark')       // RECCHI
await set('2026-05-20', 'G', 'Anthony')    // GARGANO

// 2026-05-21
await set('2026-05-21', 'B', 'Elton')      // BRAND
await set('2026-05-21', 'A', 'Scott')      // HARTNELL
await set('2026-05-21', 'R', 'Mike')       // RICHARDS
await set('2026-05-21', 'G', 'Hugh')       // DOUGLAS

// 2026-05-22
await set('2026-05-22', 'B', 'Mike')       // LIEBERTHAL
await set('2026-05-22', 'A', 'Duce')       // STALEY
await set('2026-05-22', 'R', 'Scott')      // ROLEN
await set('2026-05-22', 'G', 'Sam')        // YOUNG

// 2026-05-23
await set('2026-05-23', 'B', 'Rocky')      // BALBOA (fictional)
await set('2026-05-23', 'A', 'Jevon')      // KEARSE
await set('2026-05-23', 'R', 'Keith')      // PRIMEAU
await set('2026-05-23', 'G', 'Frank')      // GORE

// 2026-05-24
await set('2026-05-24', 'B', 'Samuel')     // DALEMBERT
await set('2026-05-24', 'A', 'Jakub')      // VORACEK
await set('2026-05-24', 'R', 'Ivan')       // PROVOROV
await set('2026-05-24', 'G', 'Rico')       // BROGNA

// 2026-05-25
await set('2026-05-25', 'B', 'Charles')    // BARKLEY
await set('2026-05-25', 'A', 'James')      // HARDEN
await set('2026-05-25', 'R', 'Al')         // MORGANTI
await set('2026-05-25', 'G', 'Joe')        // GIRARDI

// 2026-05-26
await set('2026-05-26', 'B', 'Jimmy')      // BUTLER
await set('2026-05-26', 'A', 'J.T.')       // REALMUTO
await set('2026-05-26', 'R', 'Trea')       // TURNER
await set('2026-05-26', 'G', 'Danny')      // GREEN

// 2026-05-27
await set('2026-05-27', 'B', 'Marlon')     // BYRD
await set('2026-05-27', 'A', 'Lenny')      // DYKSTRA
await set('2026-05-27', 'R', 'Jeff')       // GARCIA
await set('2026-05-27', 'G', 'Tommy')      // GREENE

// 2026-05-28
await set('2026-05-28', 'B', 'Domonic')    // BROWN
await set('2026-05-28', 'A', 'Kendall')    // SKALICKY
await set('2026-05-28', 'R', 'Jalen')      // HURTS
await set('2026-05-28', 'G', 'Jim')        // FREGOSI

// 2026-05-29
await set('2026-05-29', 'B', 'Keith')      // BYARS
await set('2026-05-29', 'A', 'Jahlil')     // OKAFOR
await set('2026-05-29', 'R', 'Eric')       // LINDROS
await set('2026-05-29', 'G', 'Jaromir')    // JAGR

// 2026-05-30
await set('2026-05-30', 'B', 'Larry')      // BOWA
await set('2026-05-30', 'A', 'James')      // THRASH
await set('2026-05-30', 'R', 'John')       // LECLAIR
await set('2026-05-30', 'G', 'Pete')       // INCAVIGLIA

// 2026-05-31
await set('2026-05-31', 'B', 'Martin')     // BIRON
await set('2026-05-31', 'A', 'Eric')       // DESJARDINS
await set('2026-05-31', 'R', 'Buddy')      // RYAN
await set('2026-05-31', 'G', 'Dan')        // MCGILLIS

// 2026-06-01
await set('2026-06-01', 'B', 'Chris')      // WEBBER
await set('2026-06-01', 'A', 'Aaron')      // NOLA
await set('2026-06-01', 'R', 'Bryce')      // HARPER
await set('2026-06-01', 'G', 'Bobby')      // HOYING

// 2026-06-02
await set('2026-06-02', 'B', 'Jeremy')     // BOYKIN
await set('2026-06-02', 'A', 'Eric')       // ALLEN
await set('2026-06-02', 'R', 'Carlos')     // RUIZ
await set('2026-06-02', 'G', 'Chris')      // GRATTON

// 2026-06-03
await set('2026-06-03', 'B', 'Steve')      // BEDROSIAN
await set('2026-06-03', 'A', 'David')      // AKERS
await set('2026-06-03', 'R', 'Andy')       // REID
await set('2026-06-03', 'G', 'Larry')      // HUGHES

// 2026-06-04
await set('2026-06-04', 'B', 'Bob')        // BOONE
await set('2026-06-04', 'A', 'Ruben')      // AMARO
await set('2026-06-04', 'R', 'Tobias')     // HARRIS
await set('2026-06-04', 'G', 'Kevin')      // GROSS

// 2026-06-05
await set('2026-06-05', 'B', 'Gary')       // BENNETT
await set('2026-06-05', 'A', 'Jeff')       // CARTER
await set('2026-06-05', 'R', 'Jon')        // RUNYAN
await set('2026-06-05', 'G', 'Bryan')      // COLANGELO

// 2026-06-06
await set('2026-06-06', 'B', 'Jon')        // BARRY
await set('2026-06-06', 'A', 'Jason')      // AVANT
await set('2026-06-06', 'R', 'Seth')       // JOYNER
await set('2026-06-06', 'G', 'Joey')       // HARRINGTON

// 2026-06-07
await set('2026-06-07', 'B', 'Tony')       // BATTIE
await set('2026-06-07', 'A', 'Tim')        // THOMAS
await set('2026-06-07', 'R', 'Jayson')     // WERTH
await set('2026-06-07', 'G', 'Eric')       // GREGG

console.log('\nAll first names set.')
