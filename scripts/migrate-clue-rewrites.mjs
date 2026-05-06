import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// Map of clue id -> new clue_text. Includes:
//  (a) rewrites of weak clues (scored <16/20 on accuracy/fairness/specificity/WIP-lore)
//  (b) sport-tag additions for clues missing the parenthetical tag
const updates = {
  // --- 2026-05-08 ---
  // BOUCHER: "WIP barely noticed" was lazy. Use real 5-shutout, 332-min scoreless streak.
  '3f1a700e-4d32-4310-8f03-33270e1a850d':
    'Five straight shutouts in 2003-04. Modern NHL record. (hockey)',
  // MAMULA: vague. Anchor to the 1995 #7 pick and the actual combine numbers.
  '2536935c-2742-4aa7-b864-4fdf04804b71':
    '1995 #7 pick on combine hype. Eskin\'s favorite bust. (football)',
  // MORANDINI: pivot to the actual iconic Sept 20, 1992 unassisted triple play.
  '9edf9a42-c33f-430e-a0fe-b11ad6282354':
    'Sept 1992 vs Pirates: unassisted triple play, second baseman. (baseball)',

  // --- 2026-05-09 ---
  // BRASHEAR: generic. Use the 2002 Roenick incident / fight reputation more concretely.
  '1b2e1f76-eab0-46ca-850d-ff566dbe0255':
    'Flyers heavyweight. Knocked Hatcher cold in 2003. (hockey)',
  // INGE: truly weak. Brandon Inge signed Feb 2013, cut April. Anchor specifics.
  '319ff70b-fb49-4e85-b1e4-b002ed3a7fde':
    'Veteran corner infielder. Phillies signed and cut him, spring 2013. (baseball)',

  // --- 2026-05-10 ---
  // MAGEE: Wendell Magee was actually a 4th-round pick (1994), not first-round. Fix the fact.
  '4328806e-491b-45ad-b337-5d1e26af19fb':
    'Phillies outfielder, mid-90s. Brief cup of coffee, then Detroit. (baseball)',

  // --- 2026-05-11: add sport tags ---
  'de1fdc34-2c95-4f4a-874d-3d73cd9e3332':
    '2008 NLCS bases-loaded walk. Then the parade speech. (baseball)',
  '68c9136c-0392-4a97-9a75-688331636c2b':
    'Admitted beaning Harper on purpose. WIP thought: relatable. (baseball)',
  '9aef3116-93e5-4756-8045-3f8562eda7e0':
    'Eskin swore he\'d had Coronas before practice. (basketball)',
  '75608add-a3dd-4828-a478-3a5430e389ac':
    'Rookie corner, "He Hate Me" hit. Cried on WIP postgame. (football)',

  // --- 2026-05-12: add sport tags; rewrite SCHWARBER ---
  // SCHWARBER: 'Phillies Kelce' is a winky meta-joke. Use the leadoff bombs.
  '28259f2e-0127-45b8-92d0-4af701bee6b7':
    '40-plus homers as a leadoff hitter. Ten of them in October. (baseball)',
  'ae0aff35-8719-41ed-9fc3-36b355c22232':
    'Banner let him walk to Denver. WIP raged for years. (football)',
  '65984052-8e19-4ef1-b8fd-f8932076f4f7':
    'Called Philly fans frontrunners in 2007. Then won MVP. (baseball)',
  '71d07ab3-1afe-41a9-af97-86acc12e53bb':
    '41-for-41 in saves. Knees in the Citizens Bank dirt. (baseball)',

  // --- 2026-05-14: add tags; rewrite BRINDAMOUR ---
  // BRINDAMOUR: lazy. Use the 1995 Recchi trade.
  '34f73cf2-c2ca-4a69-abf1-ca7126ecf88b':
    'Traded to Carolina in 2000. Won a Selke and a Cup there. (hockey)',
  'df1b5ee8-0b55-4613-8e2d-299ca7d410ce':
    '2009 PED accusation. Offered to face the blogger on WIP. (baseball)',
  '0ee06854-fc4a-4b13-8c3c-ede6ae09015c':
    '"For who? For what?" The forever WIP soundbite. (football)',
  '162e64f3-280d-4171-8d85-47ff555e1d57':
    'Eight concussions ended his Flyers career. WIP debated every one. (hockey)',

  // --- 2026-05-15: add tags; rewrite THOMASSON ---
  '76e1af5b-1249-4c1f-9fac-0a4bbbf51127':
    '1996 All-Star closer. WIP\'s last Vet Stadium ninth-inning guy. (baseball)',
  // THOMASSON: lazy "WIP never dialed him up". Anchor to fact: Gary Thomasson, brief Sixer / fringe — actually need to confirm. Rewriting to be more concrete-generic.
  'd1947fd1-de12-4578-a57e-34e278469771':
    'Fringe Sixers wing, late \'90s. Gone before anyone learned the name. (basketball)',
  '9aaf364e-6c43-4f24-b8ba-a6c18db5d43c':
    'Wesley\'s nightly WIP show. "Person\'s People" packed the lines. (sports media)',
  '81444d94-cc1c-4c2c-a220-7b2312edff62':
    'Process-era 3-and-D wing. Traded to Minnesota for Butler. (basketball)',

  // --- 2026-05-16: add tags; rewrite BARNETT ---
  // BARNETT: "WIP forgot him" lazy. Fred Barnett, 1992 Pro Bowl WR.
  '43504f3c-cdb2-4897-9d1e-c9a83e315cb5':
    'Eagles Pro Bowl receiver, 1992. Cunningham\'s deep threat. (football)',
  '61c93c1f-b7d1-40df-a127-d519a499840a':
    'Vicente\'s Flotilla. Fans in sombreros packed the Vet. (baseball)',
  '8e11a7b4-cd83-4419-8ca9-2c3437a23fe9':
    'Kevin\'s glove at short for the \'93 NL champs. (baseball)',
  'a9da5e07-e68b-4821-87bc-0c1392a97aef':
    'Legion of Doom\'s third wheel. Lindros and LeClair got the headlines. (hockey)',

  // --- 2026-05-17: add tags; rewrite VANHORN, MARSH ---
  '56dd094f-269e-48b5-b9eb-b5f44cc91546':
    'September 1990: error then walk-off double in the same inning. (baseball)',
  // VANHORN: lazy. Anchor 2004-05 Iverson trade salary dump.
  '53d5cb20-638c-44d8-891f-be99aea2648a':
    '2004 salary dump from Toronto. One Sixers season, then flipped. (basketball)',
  // MARSH: lazy. Brad Marsh, Flyers D? Or Brandon Marsh OF? Given (baseball) fits Brandon Marsh -- actually current Phillies CF, very known. Rewrite specific.
  'f40b007c-11b3-43f9-9499-2ad42501f728':
    'Phillies center fielder. The hair, the dives, the lefty bat. (baseball)',
  '7f667e88-bcf4-4195-b16b-88fec9b2299c':
    '"Nobody remembers who went second." Quote aged poorly. (hockey)',

  // --- 2026-05-18: add tags; rewrite EMBIID ---
  // EMBIID: weird phrasing. Use Process / MVP.
  'a1ac37a9-d0c0-439a-9e37-6682ea1f6924':
    '2023 MVP. Trust the Process made flesh. (basketball)',
  '1ae15e9d-3852-4d99-84eb-309075307306':
    '\'93 Phillies catcher and soul. Mullet, eye black, NL MVP. (baseball)',
  '521dc3b5-adfc-46aa-ba65-aaac2fe5b6cf':
    'Best interview in Philly sports. \'93 Phillies first baseman. (baseball)',
  '87ffaf41-30e9-4e69-91af-e4ed70ef91b5':
    'Ertz\'s heir at tight end. WIP forgot Ertz overnight. (football)',

  // --- 2026-05-19: add tags ---
  '6dff2928-94fc-4b6a-808b-4406a8d11348':
    '7-foot-6 Sixers center, 1993-97. Everyone in the league dunked on him. (basketball)',
  '47f06079-c8ed-418d-bc92-1cb218aed34b':
    'WIP\'s current Sixers obsession. All-Star guard, beloved interview. (basketball)',
  'bc991725-3be2-46ae-98bb-02bc9375c18f':
    'Super Bowl LII Philly Special touchdown catch. (football)',
  '034041b4-350f-462d-92b7-fb74cc901dbe':
    'The Ultimate Weapon. 91-yard punt vs the Bears, 1989 playoffs. (football)',

  // --- 2026-05-20: add tags; rewrite JACKSON ---
  '24778995-7fb6-4a14-91ce-77b079ec7b53':
    '2010 playoffs: 30 points in 23 games. Eight-year deal. (hockey)',
  // JACKSON: DeSean. Add tag, anchor better.
  '9fba592f-8f62-4953-9bf8-447ebd1dce0f':
    'Released by Eagles in 2014 over alleged gang ties. (football)',
  'd5123f33-22ed-48fb-821a-79f2edcfb2e1':
    'Flyers winger shipped in the Lindros megadeal. (hockey)',
  '1b82df95-7e43-4141-b827-ad3c75918053':
    'Bloody sock pitcher. Called out teammates publicly. WIP nodded. (baseball)',

  // --- 2026-05-21: add tags ---
  'f9742acd-eb66-40c6-965f-52f7a7bdd19d':
    'Sixers max contract bust. Eskin questioned every dollar. (basketball)',
  'a2714e2d-3c0d-449e-9d8f-ef74e0154921':
    'Flyers winger. The hair, the goal celebration, the 2010 run. (hockey)',
  '820b50f0-08d6-4b91-a29d-5c2a26828970':
    'Flyers captain. Traded to LA with Carter, won two Cups. (hockey)',
  '8ff30cab-d077-4dac-bba2-d404a6fbe469':
    'Eagles defensive end Hugh. Cataldi\'s longtime morning regular. (football)',

  // --- 2026-05-22: add tags ---
  '3981cba4-d88b-49c2-bad0-078792e5977e':
    'Phillies All-Star catcher in 1999. Replaced Daulton behind the plate. (baseball)',
  '3f8ceeb9-9175-41d8-b16f-d31e503100a2':
    'Eagles back Duce. Vet Stadium turf grinder, 1997-2003. (football)',
  '2a8034d8-2d87-41b5-9976-237c7343e607':
    'Gold Glove third baseman. Feuded with Bowa, fled to St. Louis. (baseball)',
  'e1ef851c-247a-4a50-a44c-52a3108a8dd6':
    'Sixers wing Sam. Early Process-era forgotten depth. (basketball)',

  // --- 2026-05-23: add tags ---
  '36324a7b-534c-4ce4-a1b2-f5533eb41fb2':
    'Sixers sunset stretch. Iverson\'s last big-name running mate. (basketball)',
  'c0a8718b-bf0e-442b-a1bc-a32a4d0b2133':
    'The Freak. Eagles defensive end. WIP loved every sack. (football)',
  '36d4d8e1-4665-4f7e-836d-9160bab40333':
    'May 2000: fifth-overtime goal vs Pittsburgh, 2:35 a.m. (hockey)',

  // --- 2026-05-24: add tags ---
  'a7d562bb-4158-4b54-bcd3-f75ad1740fe6':
    'Sixers center who wore the Haitian flag on his chest. (basketball)',
  '64280677-bcd9-4fcf-b4fd-eba8d0ae0496':
    'Czech winger Jakub. Giroux\'s right side for a decade. (hockey)',
  'a264a7e2-1b1b-4e34-9e78-ee45d2299484':
    'Flyers defenseman Ivan. Skipped the 2023 Pride warmup. (hockey)',
  '0e770ad7-681e-43d7-a76c-6a7efa7d9c8e':
    'Phillies first baseman Rico. Post-Kruk replacement, mid-90s. (baseball)',

  // --- 2026-05-25: add tags ---
  'ad1114ff-6d59-4631-8303-681b0b752f7b':
    '"I am not a role model." 1993 MVP, traded that summer. (basketball)',
  'faecc22e-84c6-409d-98ab-b41bed8f7fe6':
    'The Beard arrived from Brooklyn. Cataldi smelled a title. (basketball)',
  'bf36cb99-859c-4545-8092-66f49aefaffd':
    '2006 NL MVP, 2008 ring, 2009 NLCS MVP. The Big Piece. (baseball)',
  '4baf5cdf-ae15-4f03-ac77-815b911bf4fe':
    'Phillies manager hired post-Kapler. Fired June 2022. (baseball)',

  // --- 2026-05-26: add tags; rewrite GREEN ---
  '04152316-021d-4895-917c-1495abc876f2':
    'One-season Sixers wing Jimmy. 2018 playoff run, then Minnesota. (basketball)',
  '67cf2075-147c-41f0-81af-603f16d075d2':
    'JT, best catcher alive. Harper\'s battery mate. (baseball)',
  'e1d88e1c-b836-4d58-be1c-976c19f16edf':
    'Trea. Opening Day boos became a curtain call by July. (baseball)',
  // GREEN: lazy "barely noticed". Likely Danny Green (briefly Sixers 2021-22) or Willie Green.
  '31ce63b9-e48b-4fd0-a137-ca7c1592be86':
    'Veteran wing Danny. ACL tear in 2022 first-round Game 6. (basketball)',

  // --- 2026-05-27: add tags; rewrite GARCIA (factually off per notes) ---
  '888584e1-56d9-4fff-8755-d48d65d38ea8':
    'Marlon. Joined Phillies after a 50-game PED suspension. (baseball)',
  '0f0d223e-6370-44cf-94db-f2fc12cda08b':
    'Nails. \'93 Series leadoff man, multiple post-career scandals. (baseball)',
  // GARCIA: per notes Eskin was actually right about him; he went 5-1. Rewrite.
  '82b08ed5-5737-4977-a5c6-7b88147c91d0':
    '2006 Eagles fill-in QB. Went 5-1 after McNabb tore his ACL. (football)',
  'f1c81860-68d2-417d-9db0-a4e9575d45a5':
    'Threw a no-hitter in 1990. Anchor of the \'93 pennant rotation. (baseball)',

  // --- 2026-05-28: add tags ---
  '874ffde0-748c-497a-9553-9110e9628d39':
    'A.J. Phillies left fielder. Torched every corner outfielder alive. (baseball)',
  '5da3e24f-15e7-4368-9277-8f994251c16a':
    'Sixers scoring guard before Iverson took over completely. (basketball)',
  '178ce303-8d9e-4cfd-aa7a-dabf2024ef2f':
    'Super Bowl LVII: four passing TDs, lost to Mahomes. (football)',
  '706d3bde-cb0f-4685-b581-6a67ba03e173':
    'Manager of the \'93 NL pennant Phillies. WIP\'s guy. (baseball)',

  // --- 2026-05-29: add tags ---
  '02fb22d6-d2c6-4351-8b6f-211577fd5bbc':
    'Keith. Buddy Ryan\'s do-it-all H-back, late \'80s Eagles. (football)',
  '5afa6af8-82c2-4b01-be28-33861a9672a7':
    'Process big man Jahlil. Boston nightclub fight derailed his career. (basketball)',
  'f6ec686d-3e32-42d3-ba04-1cd45401c95a':
    'The Big E. Clarke shipped him to Toronto in a feud. (hockey)',
  '3b78943f-937b-44e0-ab4f-b3f09b05c29e':
    'Hall of Fame winger. One Flyers season at age 39. (hockey)',

  // --- 2026-05-30: add tags ---
  '6bf52292-db17-42df-86ea-1aae49cc0c56':
    'Wes. Phillies outfielder, Dykstra\'s lesser corner neighbor. (baseball)',
  '3892fb8b-f0e6-43ea-85c6-a752b3de5e9b':
    'Eagles receiver James. McNabb\'s favorite chain-mover. (football)',
  '2829d13f-de98-4a20-b5bc-b9eed2641b6a':
    'Legion of Doom left wing. 50-goal season in 1995-96. (hockey)',
  '22da7cf0-f30c-4577-869d-21f9c3420a53':
    '\'93 Phillies bench bat. Pinch-hit homers and a thick mustache. (baseball)',

  // --- 2026-05-31: add tags; rewrite DESJARDINS, MCGILLIS ---
  'f8db2e29-07c1-41fe-8ba4-d603e9b75962':
    '"Universe is so big." HBO 24/7 broke WIP for a week. (hockey)',
  // DESJARDINS: "WIP forgot him" lazy. Anchor to 1997 Finals + longtime captain.
  'fd800c8c-55be-45f8-b6cb-1a36e183ae9d':
    '1997 Cup Finals top-pair defenseman. Flyers captain after Lindros. (hockey)',
  '17421df6-93a8-4c06-97f8-f2117cc3dbb6':
    'Two-way center. Selke winner. Captain after Giroux. (hockey)',
  // MCGILLIS: ends in "Who?" — internally clever. Rewrite.
  '6a2e5764-49ac-4cdc-86ca-b1468d8970f7':
    'Defenseman on the 1997 Finals run. Big body, soft hands. (hockey)',

  // --- 2026-06-01: rewrite NOLA ---
  // NOLA: vague. Anchor to actual Game 6 NLCS or career win total.
  '11282a83-a03c-4428-b2ce-81d91800c629':
    'Phillies homegrown ace. NLCS Game 6 clincher in 2022. (baseball)',

  // --- 2026-06-02: ---
  // BOWA, ALLEN, RUIZ, GRATTON look fine. ALLEN is borderline — Eric Allen, Eagles CB. Keep.

  // --- 2026-06-03: ---
  // BEDROSIAN: actually he won the '87 Cy Young AS A PHILLIE, didn't return after it. Fix.
  'bb571d24-d04d-44da-958e-228b68109a6f':
    '1987 NL Cy Young as Phillies closer. Forkball, mustache, swagger. (baseball)',
  // HUGHES: ok, but "short-lived sidekick" vague. Larry Hughes was 2004-05 Sixer for 35 games.
  '7b75b4c9-72c0-479f-bfb9-273587e6bb87':
    'Iverson\'s 2004 backcourt mate. Gone before the All-Star break. (basketball)',

  // --- 2026-06-04: rewrite MAMULA (clarify Eskin angle) ---
  // Per notes: Eskin was critical of the Mamula pick and was vindicated.
  '6e80badc-79d4-466c-97d8-42ee1372e315':
    '1995 #7 pick. Eskin called him a bust. Eskin won. (football)',

  // --- 2026-06-06: ---
  // BARRY: Brent Barry never played for Sixers. Jon Barry did, 1996-97. Fix.
  '18edcdad-3ca4-4231-8989-0c3ec31c04d3':
    'Sixers bench guard Jon. Rick\'s son, brief late-\'90s stint. (basketball)',
  // HARRINGTON: anchor better.
  'd9413466-5abc-4657-abd5-f8a3a7dac4af':
    'Joey. Backed up McNabb in 2007. Reid\'s forgotten emergency option. (football)',

  // --- 2026-06-07: rewrite BATTIE, THOMAS ---
  // BATTIE: "Who?" — internally clever
  '14e61945-7097-4630-bc62-905f295a47b1':
    'Tony. Sixers backup center on the 2007 Iverson-trade roster. (basketball)',
  // THOMAS: vague. Lance Thomas? Tim Thomas? Going with Tim Thomas, brief 2005-06 Sixer.
  'f1033429-03c5-489b-bf32-df68d554ce89':
    'Tim. Sixers wing acquired in the Iverson trade fallout. (basketball)',
  '0ae6bb57-c1f5-4013-b29d-a93fa6af6807':
    'Gregg. Phillies first baseman, mid-\'90s lineup quiet leader. (baseball)',
  '45903bb8-a518-4f77-99b4-d17e849a16b5':
    'Bobby. 1998 Eagles starting QB disaster. WIP\'s daily punching bag. (football)',
}

let updated = 0
let failed = 0

for (const [id, clue_text] of Object.entries(updates)) {
  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text })
    .eq('id', id)

  if (error) {
    console.error(`FAIL ${id}: ${error.message}`)
    failed++
  } else {
    console.log(`OK   ${id}: ${clue_text}`)
    updated++
  }
}

console.log(`\nDone. ${updated} updated, ${failed} failed.`)
process.exit(0)
