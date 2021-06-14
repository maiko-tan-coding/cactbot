/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 687:
/***/ ((__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {


// UNUSED EXPORTS: default

// EXTERNAL MODULE: ./resources/overlay_plugin_api.ts
var overlay_plugin_api = __webpack_require__(906);
// EXTERNAL MODULE: ./resources/regexes.ts
var regexes = __webpack_require__(201);
// EXTERNAL MODULE: ./resources/user_config.ts
var user_config = __webpack_require__(970);
// EXTERNAL MODULE: ./resources/zone_info.ts
var zone_info = __webpack_require__(810);
// EXTERNAL MODULE: ./resources/zone_id.ts
var zone_id = __webpack_require__(438);
;// CONCATENATED MODULE: ./resources/content_list.ts

// Ordered as per duty finder.  This is intended to be used as ordering for
// any ui that is dealing with multiple zones / triggers.
//
// These are not things that cactbot necessarily supports, but things that it
// theoretically could be supporting in the future with raidboss and oopsy.
const contentList = [
    // General (cactbot custom zone id)
    zone_id/* default.MatchAll */.Z.MatchAll,
    // Dungeons (A Realm Reborn)
    zone_id/* default.Sastasha */.Z.Sastasha,
    zone_id/* default.TheTamTaraDeepcroft */.Z.TheTamTaraDeepcroft,
    zone_id/* default.CopperbellMines */.Z.CopperbellMines,
    zone_id/* default.Halatali */.Z.Halatali,
    zone_id/* default.TheThousandMawsOfTotoRak */.Z.TheThousandMawsOfTotoRak,
    zone_id/* default.HaukkeManor */.Z.HaukkeManor,
    zone_id/* default.BrayfloxsLongstop */.Z.BrayfloxsLongstop,
    zone_id/* default.TheSunkenTempleOfQarn */.Z.TheSunkenTempleOfQarn,
    zone_id/* default.CuttersCry */.Z.CuttersCry,
    zone_id/* default.TheStoneVigil */.Z.TheStoneVigil,
    zone_id/* default.DzemaelDarkhold */.Z.DzemaelDarkhold,
    zone_id/* default.TheAurumVale */.Z.TheAurumVale,
    zone_id/* default.TheWanderersPalace */.Z.TheWanderersPalace,
    zone_id/* default.CastrumMeridianum */.Z.CastrumMeridianum,
    zone_id/* default.ThePraetorium */.Z.ThePraetorium,
    zone_id/* default.AmdaporKeep */.Z.AmdaporKeep,
    zone_id/* default.PharosSirius */.Z.PharosSirius,
    zone_id/* default.CopperbellMinesHard */.Z.CopperbellMinesHard,
    zone_id/* default.HaukkeManorHard */.Z.HaukkeManorHard,
    zone_id/* default.TheLostCityOfAmdapor */.Z.TheLostCityOfAmdapor,
    zone_id/* default.HalataliHard */.Z.HalataliHard,
    zone_id/* default.BrayfloxsLongstopHard */.Z.BrayfloxsLongstopHard,
    zone_id/* default.HullbreakerIsle */.Z.HullbreakerIsle,
    zone_id/* default.TheTamTaraDeepcroftHard */.Z.TheTamTaraDeepcroftHard,
    zone_id/* default.TheStoneVigilHard */.Z.TheStoneVigilHard,
    zone_id/* default.Snowcloak */.Z.Snowcloak,
    zone_id/* default.SastashaHard */.Z.SastashaHard,
    zone_id/* default.TheSunkenTempleOfQarnHard */.Z.TheSunkenTempleOfQarnHard,
    zone_id/* default.TheKeeperOfTheLake */.Z.TheKeeperOfTheLake,
    zone_id/* default.TheWanderersPalaceHard */.Z.TheWanderersPalaceHard,
    zone_id/* default.AmdaporKeepHard */.Z.AmdaporKeepHard,
    // Dungeons (Heavensward)
    zone_id/* default.TheDuskVigil */.Z.TheDuskVigil,
    zone_id/* default.SohmAl */.Z.SohmAl,
    zone_id/* default.TheAery */.Z.TheAery,
    zone_id/* default.TheVault */.Z.TheVault,
    zone_id/* default.TheGreatGubalLibrary */.Z.TheGreatGubalLibrary,
    zone_id/* default.TheAetherochemicalResearchFacility */.Z.TheAetherochemicalResearchFacility,
    zone_id/* default.Neverreap */.Z.Neverreap,
    zone_id/* default.TheFractalContinuum */.Z.TheFractalContinuum,
    zone_id/* default.SaintMociannesArboretum */.Z.SaintMociannesArboretum,
    zone_id/* default.PharosSiriusHard */.Z.PharosSiriusHard,
    zone_id/* default.TheAntitower */.Z.TheAntitower,
    zone_id/* default.TheLostCityOfAmdaporHard */.Z.TheLostCityOfAmdaporHard,
    zone_id/* default.SohrKhai */.Z.SohrKhai,
    zone_id/* default.HullbreakerIsleHard */.Z.HullbreakerIsleHard,
    zone_id/* default.Xelphatol */.Z.Xelphatol,
    zone_id/* default.TheGreatGubalLibraryHard */.Z.TheGreatGubalLibraryHard,
    zone_id/* default.BaelsarsWall */.Z.BaelsarsWall,
    zone_id/* default.SohmAlHard */.Z.SohmAlHard,
    // Dungeons (Stormblood)
    zone_id/* default.TheSirensongSea */.Z.TheSirensongSea,
    zone_id/* default.ShisuiOfTheVioletTides */.Z.ShisuiOfTheVioletTides,
    zone_id/* default.BardamsMettle */.Z.BardamsMettle,
    zone_id/* default.DomaCastle */.Z.DomaCastle,
    zone_id/* default.CastrumAbania */.Z.CastrumAbania,
    zone_id/* default.AlaMhigo */.Z.AlaMhigo,
    zone_id/* default.KuganeCastle */.Z.KuganeCastle,
    zone_id/* default.TheTempleOfTheFist */.Z.TheTempleOfTheFist,
    zone_id/* default.TheDrownedCityOfSkalla */.Z.TheDrownedCityOfSkalla,
    zone_id/* default.HellsLid */.Z.HellsLid,
    zone_id/* default.TheFractalContinuumHard */.Z.TheFractalContinuumHard,
    zone_id/* default.TheSwallowsCompass */.Z.TheSwallowsCompass,
    zone_id/* default.TheBurn */.Z.TheBurn,
    zone_id/* default.SaintMociannesArboretumHard */.Z.SaintMociannesArboretumHard,
    zone_id/* default.TheGhimlytDark */.Z.TheGhimlytDark,
    // Dungeons (Shadowbringers)
    zone_id/* default.HolminsterSwitch */.Z.HolminsterSwitch,
    zone_id/* default.DohnMheg */.Z.DohnMheg,
    zone_id/* default.TheQitanaRavel */.Z.TheQitanaRavel,
    zone_id/* default.MalikahsWell */.Z.MalikahsWell,
    zone_id/* default.MtGulg */.Z.MtGulg,
    zone_id/* default.Amaurot */.Z.Amaurot,
    zone_id/* default.TheTwinning */.Z.TheTwinning,
    zone_id/* default.AkadaemiaAnyder */.Z.AkadaemiaAnyder,
    zone_id/* default.TheGrandCosmos */.Z.TheGrandCosmos,
    zone_id/* default.AnamnesisAnyder */.Z.AnamnesisAnyder,
    zone_id/* default.TheHeroesGauntlet */.Z.TheHeroesGauntlet,
    zone_id/* default.MatoyasRelict */.Z.MatoyasRelict,
    zone_id/* default.Paglthan */.Z.Paglthan,
    // Guildhests
    zone_id/* default.BasicTrainingEnemyParties */.Z.BasicTrainingEnemyParties,
    zone_id/* default.UnderTheArmor */.Z.UnderTheArmor,
    zone_id/* default.BasicTrainingEnemyStrongholds */.Z.BasicTrainingEnemyStrongholds,
    zone_id/* default.HeroOnTheHalfShell */.Z.HeroOnTheHalfShell,
    zone_id/* default.PullingPoisonPosies */.Z.PullingPoisonPosies,
    zone_id/* default.StingingBack */.Z.StingingBack,
    zone_id/* default.AllsWellThatEndsInTheWell */.Z.AllsWellThatEndsInTheWell,
    zone_id/* default.FlickingSticksAndTakingNames */.Z.FlickingSticksAndTakingNames,
    zone_id/* default.MoreThanAFeeler */.Z.MoreThanAFeeler,
    zone_id/* default.AnnoyTheVoid */.Z.AnnoyTheVoid,
    zone_id/* default.ShadowAndClaw */.Z.ShadowAndClaw,
    zone_id/* default.LongLiveTheQueen */.Z.LongLiveTheQueen,
    zone_id/* default.WardUp */.Z.WardUp,
    zone_id/* default.SolemnTrinity */.Z.SolemnTrinity,
    // Trials (A Realm Reborn)
    zone_id/* default.TheBowlOfEmbers */.Z.TheBowlOfEmbers,
    zone_id/* default.TheNavel */.Z.TheNavel,
    zone_id/* default.TheHowlingEye */.Z.TheHowlingEye,
    zone_id/* default.CapeWestwind */.Z.CapeWestwind,
    zone_id/* default.TheChrysalis */.Z.TheChrysalis,
    zone_id/* default.TheStepsOfFaith */.Z.TheStepsOfFaith,
    zone_id/* default.ARelicRebornTheChimera */.Z.ARelicRebornTheChimera,
    zone_id/* default.ARelicRebornTheHydra */.Z.ARelicRebornTheHydra,
    zone_id/* default.BattleOnTheBigBridge */.Z.BattleOnTheBigBridge,
    zone_id/* default.TheDragonsNeck */.Z.TheDragonsNeck,
    zone_id/* default.BattleInTheBigKeep */.Z.BattleInTheBigKeep,
    zone_id/* default.TheBowlOfEmbersHard */.Z.TheBowlOfEmbersHard,
    zone_id/* default.TheHowlingEyeHard */.Z.TheHowlingEyeHard,
    zone_id/* default.TheNavelHard */.Z.TheNavelHard,
    zone_id/* default.ThornmarchHard */.Z.ThornmarchHard,
    zone_id/* default.TheWhorleaterHard */.Z.TheWhorleaterHard,
    zone_id/* default.TheStrikingTreeHard */.Z.TheStrikingTreeHard,
    zone_id/* default.TheAkhAfahAmphitheatreHard */.Z.TheAkhAfahAmphitheatreHard,
    zone_id/* default.UrthsFount */.Z.UrthsFount,
    // High-end Trials (A Realm Reborn)
    zone_id/* default.TheMinstrelsBalladUltimasBane */.Z.TheMinstrelsBalladUltimasBane,
    zone_id/* default.TheHowlingEyeExtreme */.Z.TheHowlingEyeExtreme,
    zone_id/* default.TheNavelExtreme */.Z.TheNavelExtreme,
    zone_id/* default.TheBowlOfEmbersExtreme */.Z.TheBowlOfEmbersExtreme,
    zone_id/* default.ThornmarchExtreme */.Z.ThornmarchExtreme,
    zone_id/* default.TheWhorleaterExtreme */.Z.TheWhorleaterExtreme,
    zone_id/* default.TheStrikingTreeExtreme */.Z.TheStrikingTreeExtreme,
    zone_id/* default.TheAkhAfahAmphitheatreExtreme */.Z.TheAkhAfahAmphitheatreExtreme,
    // Trials (Heavensward)
    zone_id/* default.ThokAstThokHard */.Z.ThokAstThokHard,
    zone_id/* default.TheLimitlessBlueHard */.Z.TheLimitlessBlueHard,
    zone_id/* default.TheSingularityReactor */.Z.TheSingularityReactor,
    zone_id/* default.TheFinalStepsOfFaith */.Z.TheFinalStepsOfFaith,
    zone_id/* default.ContainmentBayS1T7 */.Z.ContainmentBayS1T7,
    zone_id/* default.ContainmentBayP1T6 */.Z.ContainmentBayP1T6,
    zone_id/* default.ContainmentBayZ1T9 */.Z.ContainmentBayZ1T9,
    // High-end Trials (Heavensward)
    zone_id/* default.TheLimitlessBlueExtreme */.Z.TheLimitlessBlueExtreme,
    zone_id/* default.ThokAstThokExtreme */.Z.ThokAstThokExtreme,
    zone_id/* default.TheMinstrelsBalladThordansReign */.Z.TheMinstrelsBalladThordansReign,
    zone_id/* default.TheMinstrelsBalladNidhoggsRage */.Z.TheMinstrelsBalladNidhoggsRage,
    zone_id/* default.ContainmentBayS1T7Extreme */.Z.ContainmentBayS1T7Extreme,
    zone_id/* default.ContainmentBayP1T6Extreme */.Z.ContainmentBayP1T6Extreme,
    zone_id/* default.ContainmentBayZ1T9Extreme */.Z.ContainmentBayZ1T9Extreme,
    // Trials (Stormblood)
    zone_id/* default.ThePoolOfTribute */.Z.ThePoolOfTribute,
    zone_id/* default.Emanation */.Z.Emanation,
    zone_id/* default.TheRoyalMenagerie */.Z.TheRoyalMenagerie,
    zone_id/* default.CastrumFluminis */.Z.CastrumFluminis,
    zone_id/* default.KuganeOhashi */.Z.KuganeOhashi,
    zone_id/* default.TheGreatHunt */.Z.TheGreatHunt,
    zone_id/* default.TheJadeStoa */.Z.TheJadeStoa,
    zone_id/* default.HellsKier */.Z.HellsKier,
    zone_id/* default.TheWreathOfSnakes */.Z.TheWreathOfSnakes,
    // High-end Trials (Stormblood)
    zone_id/* default.ThePoolOfTributeExtreme */.Z.ThePoolOfTributeExtreme,
    zone_id/* default.EmanationExtreme */.Z.EmanationExtreme,
    zone_id/* default.TheMinstrelsBalladShinryusDomain */.Z.TheMinstrelsBalladShinryusDomain,
    zone_id/* default.TheMinstrelsBalladTsukuyomisPain */.Z.TheMinstrelsBalladTsukuyomisPain,
    zone_id/* default.TheGreatHuntExtreme */.Z.TheGreatHuntExtreme,
    zone_id/* default.TheJadeStoaExtreme */.Z.TheJadeStoaExtreme,
    zone_id/* default.HellsKierExtreme */.Z.HellsKierExtreme,
    zone_id/* default.TheWreathOfSnakesExtreme */.Z.TheWreathOfSnakesExtreme,
    // Trials (Shadowbringers)
    zone_id/* default.TheDancingPlague */.Z.TheDancingPlague,
    zone_id/* default.TheCrownOfTheImmaculate */.Z.TheCrownOfTheImmaculate,
    zone_id/* default.TheDyingGasp */.Z.TheDyingGasp,
    zone_id/* default.CinderDrift */.Z.CinderDrift,
    zone_id/* default.TheSeatOfSacrifice */.Z.TheSeatOfSacrifice,
    zone_id/* default.CastrumMarinum */.Z.CastrumMarinum,
    zone_id/* default.TheCloudDeck */.Z.TheCloudDeck,
    // High-end Trials (Shadowbringers)
    zone_id/* default.TheDancingPlagueExtreme */.Z.TheDancingPlagueExtreme,
    zone_id/* default.TheCrownOfTheImmaculateExtreme */.Z.TheCrownOfTheImmaculateExtreme,
    zone_id/* default.TheMinstrelsBalladHadessElegy */.Z.TheMinstrelsBalladHadessElegy,
    zone_id/* default.CinderDriftExtreme */.Z.CinderDriftExtreme,
    zone_id/* default.MemoriaMiseraExtreme */.Z.MemoriaMiseraExtreme,
    zone_id/* default.TheSeatOfSacrificeExtreme */.Z.TheSeatOfSacrificeExtreme,
    zone_id/* default.CastrumMarinumExtreme */.Z.CastrumMarinumExtreme,
    zone_id/* default.TheCloudDeckExtreme */.Z.TheCloudDeckExtreme,
    zone_id/* default.TheAkhAfahAmphitheatreUnreal */.Z.TheAkhAfahAmphitheatreUnreal,
    zone_id/* default.TheNavelUnreal */.Z.TheNavelUnreal,
    zone_id/* default.TheWhorleaterUnreal */.Z.TheWhorleaterUnreal,
    // Alliance Raids (A Realm Reborn)
    zone_id/* default.TheLabyrinthOfTheAncients */.Z.TheLabyrinthOfTheAncients,
    zone_id/* default.SyrcusTower */.Z.SyrcusTower,
    zone_id/* default.TheWorldOfDarkness */.Z.TheWorldOfDarkness,
    // Raids (A Realm Reborn)
    zone_id/* default.TheBindingCoilOfBahamutTurn1 */.Z.TheBindingCoilOfBahamutTurn1,
    zone_id/* default.TheBindingCoilOfBahamutTurn2 */.Z.TheBindingCoilOfBahamutTurn2,
    zone_id/* default.TheBindingCoilOfBahamutTurn3 */.Z.TheBindingCoilOfBahamutTurn3,
    zone_id/* default.TheBindingCoilOfBahamutTurn4 */.Z.TheBindingCoilOfBahamutTurn4,
    zone_id/* default.TheBindingCoilOfBahamutTurn5 */.Z.TheBindingCoilOfBahamutTurn5,
    zone_id/* default.TheSecondCoilOfBahamutTurn1 */.Z.TheSecondCoilOfBahamutTurn1,
    zone_id/* default.TheSecondCoilOfBahamutTurn2 */.Z.TheSecondCoilOfBahamutTurn2,
    zone_id/* default.TheSecondCoilOfBahamutTurn3 */.Z.TheSecondCoilOfBahamutTurn3,
    zone_id/* default.TheSecondCoilOfBahamutTurn4 */.Z.TheSecondCoilOfBahamutTurn4,
    zone_id/* default.TheFinalCoilOfBahamutTurn1 */.Z.TheFinalCoilOfBahamutTurn1,
    zone_id/* default.TheFinalCoilOfBahamutTurn2 */.Z.TheFinalCoilOfBahamutTurn2,
    zone_id/* default.TheFinalCoilOfBahamutTurn3 */.Z.TheFinalCoilOfBahamutTurn3,
    zone_id/* default.TheFinalCoilOfBahamutTurn4 */.Z.TheFinalCoilOfBahamutTurn4,
    // Savage Raids (A Realm Reborn)
    zone_id/* default.TheSecondCoilOfBahamutSavageTurn1 */.Z.TheSecondCoilOfBahamutSavageTurn1,
    zone_id/* default.TheSecondCoilOfBahamutSavageTurn2 */.Z.TheSecondCoilOfBahamutSavageTurn2,
    zone_id/* default.TheSecondCoilOfBahamutSavageTurn3 */.Z.TheSecondCoilOfBahamutSavageTurn3,
    zone_id/* default.TheSecondCoilOfBahamutSavageTurn4 */.Z.TheSecondCoilOfBahamutSavageTurn4,
    // Alliance Raids (Heavensward)
    zone_id/* default.TheVoidArk */.Z.TheVoidArk,
    zone_id/* default.TheWeepingCityOfMhach */.Z.TheWeepingCityOfMhach,
    zone_id/* default.DunScaith */.Z.DunScaith,
    // Normal Raids (Heavensward)
    zone_id/* default.AlexanderTheFistOfTheFather */.Z.AlexanderTheFistOfTheFather,
    zone_id/* default.AlexanderTheCuffOfTheFather */.Z.AlexanderTheCuffOfTheFather,
    zone_id/* default.AlexanderTheArmOfTheFather */.Z.AlexanderTheArmOfTheFather,
    zone_id/* default.AlexanderTheBurdenOfTheFather */.Z.AlexanderTheBurdenOfTheFather,
    zone_id/* default.AlexanderTheFistOfTheSon */.Z.AlexanderTheFistOfTheSon,
    zone_id/* default.AlexanderTheCuffOfTheSon */.Z.AlexanderTheCuffOfTheSon,
    zone_id/* default.AlexanderTheArmOfTheSon */.Z.AlexanderTheArmOfTheSon,
    zone_id/* default.AlexanderTheBurdenOfTheSon */.Z.AlexanderTheBurdenOfTheSon,
    zone_id/* default.AlexanderTheEyesOfTheCreator */.Z.AlexanderTheEyesOfTheCreator,
    zone_id/* default.AlexanderTheBreathOfTheCreator */.Z.AlexanderTheBreathOfTheCreator,
    zone_id/* default.AlexanderTheHeartOfTheCreator */.Z.AlexanderTheHeartOfTheCreator,
    zone_id/* default.AlexanderTheSoulOfTheCreator */.Z.AlexanderTheSoulOfTheCreator,
    // Savage Raids (Heavensward)
    zone_id/* default.AlexanderTheFistOfTheFatherSavage */.Z.AlexanderTheFistOfTheFatherSavage,
    zone_id/* default.AlexanderTheCuffOfTheFatherSavage */.Z.AlexanderTheCuffOfTheFatherSavage,
    zone_id/* default.AlexanderTheArmOfTheFatherSavage */.Z.AlexanderTheArmOfTheFatherSavage,
    zone_id/* default.AlexanderTheBurdenOfTheFatherSavage */.Z.AlexanderTheBurdenOfTheFatherSavage,
    zone_id/* default.AlexanderTheFistOfTheSonSavage */.Z.AlexanderTheFistOfTheSonSavage,
    zone_id/* default.AlexanderTheCuffOfTheSonSavage */.Z.AlexanderTheCuffOfTheSonSavage,
    zone_id/* default.AlexanderTheArmOfTheSonSavage */.Z.AlexanderTheArmOfTheSonSavage,
    zone_id/* default.AlexanderTheBurdenOfTheSonSavage */.Z.AlexanderTheBurdenOfTheSonSavage,
    zone_id/* default.AlexanderTheEyesOfTheCreatorSavage */.Z.AlexanderTheEyesOfTheCreatorSavage,
    zone_id/* default.AlexanderTheBreathOfTheCreatorSavage */.Z.AlexanderTheBreathOfTheCreatorSavage,
    zone_id/* default.AlexanderTheHeartOfTheCreatorSavage */.Z.AlexanderTheHeartOfTheCreatorSavage,
    zone_id/* default.AlexanderTheSoulOfTheCreatorSavage */.Z.AlexanderTheSoulOfTheCreatorSavage,
    // Alliance Raids (Stormblood)
    zone_id/* default.TheRoyalCityOfRabanastre */.Z.TheRoyalCityOfRabanastre,
    zone_id/* default.TheRidoranaLighthouse */.Z.TheRidoranaLighthouse,
    zone_id/* default.TheOrbonneMonastery */.Z.TheOrbonneMonastery,
    // Normal Raids (Stormblood)
    zone_id/* default.DeltascapeV10 */.Z.DeltascapeV10,
    zone_id/* default.DeltascapeV20 */.Z.DeltascapeV20,
    zone_id/* default.DeltascapeV30 */.Z.DeltascapeV30,
    zone_id/* default.DeltascapeV40 */.Z.DeltascapeV40,
    zone_id/* default.SigmascapeV10 */.Z.SigmascapeV10,
    zone_id/* default.SigmascapeV20 */.Z.SigmascapeV20,
    zone_id/* default.SigmascapeV30 */.Z.SigmascapeV30,
    zone_id/* default.SigmascapeV40 */.Z.SigmascapeV40,
    zone_id/* default.AlphascapeV10 */.Z.AlphascapeV10,
    zone_id/* default.AlphascapeV20 */.Z.AlphascapeV20,
    zone_id/* default.AlphascapeV30 */.Z.AlphascapeV30,
    zone_id/* default.AlphascapeV40 */.Z.AlphascapeV40,
    // Savage Raids (Stormblood)
    zone_id/* default.DeltascapeV10Savage */.Z.DeltascapeV10Savage,
    zone_id/* default.DeltascapeV20Savage */.Z.DeltascapeV20Savage,
    zone_id/* default.DeltascapeV30Savage */.Z.DeltascapeV30Savage,
    zone_id/* default.DeltascapeV40Savage */.Z.DeltascapeV40Savage,
    zone_id/* default.SigmascapeV10Savage */.Z.SigmascapeV10Savage,
    zone_id/* default.SigmascapeV20Savage */.Z.SigmascapeV20Savage,
    zone_id/* default.SigmascapeV30Savage */.Z.SigmascapeV30Savage,
    zone_id/* default.SigmascapeV40Savage */.Z.SigmascapeV40Savage,
    zone_id/* default.AlphascapeV10Savage */.Z.AlphascapeV10Savage,
    zone_id/* default.AlphascapeV20Savage */.Z.AlphascapeV20Savage,
    zone_id/* default.AlphascapeV30Savage */.Z.AlphascapeV30Savage,
    zone_id/* default.AlphascapeV40Savage */.Z.AlphascapeV40Savage,
    // Alliance Raids (Shadowbringers)
    zone_id/* default.TheCopiedFactory */.Z.TheCopiedFactory,
    zone_id/* default.ThePuppetsBunker */.Z.ThePuppetsBunker,
    zone_id/* default.TheTowerAtParadigmsBreach */.Z.TheTowerAtParadigmsBreach,
    // Normal Raids (Shadowbringers)
    zone_id/* default.EdensGateResurrection */.Z.EdensGateResurrection,
    zone_id/* default.EdensGateDescent */.Z.EdensGateDescent,
    zone_id/* default.EdensGateInundation */.Z.EdensGateInundation,
    zone_id/* default.EdensGateSepulture */.Z.EdensGateSepulture,
    zone_id/* default.EdensVerseFulmination */.Z.EdensVerseFulmination,
    zone_id/* default.EdensVerseFuror */.Z.EdensVerseFuror,
    zone_id/* default.EdensVerseIconoclasm */.Z.EdensVerseIconoclasm,
    zone_id/* default.EdensVerseRefulgence */.Z.EdensVerseRefulgence,
    zone_id/* default.EdensPromiseUmbra */.Z.EdensPromiseUmbra,
    zone_id/* default.EdensPromiseLitany */.Z.EdensPromiseLitany,
    zone_id/* default.EdensPromiseAnamorphosis */.Z.EdensPromiseAnamorphosis,
    zone_id/* default.EdensPromiseEternity */.Z.EdensPromiseEternity,
    // Savage Raids (Shadowbringers)
    zone_id/* default.EdensGateResurrectionSavage */.Z.EdensGateResurrectionSavage,
    zone_id/* default.EdensGateDescentSavage */.Z.EdensGateDescentSavage,
    zone_id/* default.EdensGateInundationSavage */.Z.EdensGateInundationSavage,
    zone_id/* default.EdensGateSepultureSavage */.Z.EdensGateSepultureSavage,
    zone_id/* default.EdensVerseFulminationSavage */.Z.EdensVerseFulminationSavage,
    zone_id/* default.EdensVerseFurorSavage */.Z.EdensVerseFurorSavage,
    zone_id/* default.EdensVerseIconoclasmSavage */.Z.EdensVerseIconoclasmSavage,
    zone_id/* default.EdensVerseRefulgenceSavage */.Z.EdensVerseRefulgenceSavage,
    zone_id/* default.EdensPromiseUmbraSavage */.Z.EdensPromiseUmbraSavage,
    zone_id/* default.EdensPromiseLitanySavage */.Z.EdensPromiseLitanySavage,
    zone_id/* default.EdensPromiseAnamorphosisSavage */.Z.EdensPromiseAnamorphosisSavage,
    zone_id/* default.EdensPromiseEternitySavage */.Z.EdensPromiseEternitySavage,
    // Ultimate Raids
    zone_id/* default.TheUnendingCoilOfBahamutUltimate */.Z.TheUnendingCoilOfBahamutUltimate,
    zone_id/* default.TheWeaponsRefrainUltimate */.Z.TheWeaponsRefrainUltimate,
    zone_id/* default.TheEpicOfAlexanderUltimate */.Z.TheEpicOfAlexanderUltimate,
];
/* harmony default export */ const content_list = (contentList);

;// CONCATENATED MODULE: ./ui/config/general_config.js

user_config/* default.registerOptions */.Z.registerOptions('general', {
  options: [{
    id: 'CactbotUserDirectory',
    name: {
      en: 'Cactbot user directory',
      de: 'Cactbot Benutzerverzeichnis',
      fr: 'Répertoire utilisateur de Cactbot',
      ja: 'Cactbot ユーザーディレクトリ',
      cn: 'Cactbot user目录',
      ko: 'Cactbot 사용자 디렉토리'
    },
    type: 'directory',
    default: ''
  }, {
    id: 'ShowDeveloperOptions',
    name: {
      en: 'Show developer options',
      de: 'Zeige Entwickleroptionen',
      fr: 'Afficher les options développeur',
      ja: '開発者向けオプション',
      cn: '显示开发者选项',
      ko: '개발자 옵션 표시'
    },
    type: 'checkbox',
    default: false
  }, {
    id: 'DisplayLanguage',
    name: {
      en: 'Display language',
      de: 'Displaysprache',
      fr: 'Langue d\'affichage',
      ja: '表示言語',
      cn: '显示语言',
      ko: '주 사용 언어'
    },
    type: 'select',
    options: {
      en: {
        'Use FFXIV Plugin Language': 'default',
        'English (en)': 'en',
        'Chinese (cn)': 'cn',
        'German (de)': 'de',
        'French (fr)': 'fr',
        'Japanese (ja)': 'ja',
        'Korean (ko)': 'ko'
      },
      de: {
        'Benutze FFXIV Plugin Sprache': 'default',
        'Englisch (en)': 'en',
        'Chinesisch (cn)': 'cn',
        'Deutsch (de)': 'de',
        'Französisch (fr)': 'fr',
        'Japanisch (ja)': 'ja',
        'Koreanisch (ko)': 'ko'
      },
      fr: {
        'Utiliser la langue du Plugin FFXIV': 'default',
        'Anglais (en)': 'en',
        'Chinois (cn)': 'cn',
        'Allemand (de)': 'de',
        'Français (fr)': 'fr',
        'Japonais (ja)': 'ja',
        'Coréen (ko)': 'ko'
      },
      ja: {
        'FFXIV Pluginの言語設定': 'default',
        '英語 (en)': 'en',
        '中国語 (cn)': 'cn',
        'ドイツ語 (de)': 'de',
        'フランス語 (fr)': 'fr',
        '日本語 (ja)': 'ja',
        '韓国語 (ko)': 'ko'
      },
      cn: {
        '使用最终幻想XIV解析插件设置的语言': 'default',
        '英语 (en)': 'en',
        '中文 (cn)': 'cn',
        '德语 (de)': 'de',
        '法语 (fr)': 'fr',
        '日语 (ja)': 'ja',
        '韩语 (ko)': 'ko'
      },
      ko: {
        'FFXIV Plugin 언어 사용': 'default',
        '영어 (en)': 'en',
        '중국어 (cn)': 'cn',
        '독일어 (de)': 'de',
        '프랑스어 (fr)': 'fr',
        '일본어 (ja)': 'ja',
        '한국어 (ko)': 'ko'
      }
    },
    default: 'default',
    debug: true,
    setterFunc: (options, value) => {
      if (value === 'default') return;
      options['DisplayLanguage'] = value;
    }
  }]
});
;// CONCATENATED MODULE: ./ui/eureka/eureka_config.ts

user_config/* default.registerOptions */.Z.registerOptions('eureka', {
    options: [
        {
            id: 'Debug',
            name: {
                en: 'Enable debug mode',
                de: 'Aktiviere Debugmodus',
                fr: 'Activer le mode debug',
                ja: 'デバッグモードを有効にする',
                cn: '启用调试模式',
                ko: '디버그 모드 활성화',
            },
            default: false,
            type: 'checkbox',
            debugOnly: true,
        },
        {
            id: 'FlagTimeoutSeconds',
            name: {
                en: 'Duration of flags on the map (seconds)',
                de: 'Zeit der Flaggen auf der Karte (in Sekunden)',
                fr: 'Durée des drapeaux sur la carte en (s)',
                ja: 'マップにマーカーの表示時間 (秒)',
                cn: '地图标志显示时间 (秒)',
                ko: '지도에 깃발이 표시될 시간 (초)',
            },
            type: 'float',
            default: 90,
            setterFunc: (options, value) => {
                if (typeof value !== 'number')
                    return;
                options['FlagTimeoutMs'] = value * 1000;
            },
        },
        {
            id: 'PopNoiseForNM',
            name: {
                en: 'Play pop sound for NMs',
                de: 'Spiele Pop-Sound ab für NMs',
                fr: 'Jouer un son pour l\'apparition des NMs',
                ja: 'NM通知機能を有効にする',
                cn: 'NM出现时播放提示音',
                ko: '돌발임무 알림 소리 켜기',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'PopNoiseForBunny',
            name: {
                en: 'Play pop sound for bunny fates',
                de: 'Spiele Pop-Sound ab für Bunny-Fates',
                fr: 'Jouer un son pour l\'apparition de l\'aléa des lapins',
                ja: 'しあわせうさぎ通知機能を有効にする',
                cn: '幸福兔出现时播放提示音',
                ko: '토끼 돌발 알림 소리 켜기',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'PopNoiseForSkirmish',
            name: {
                en: 'Play pop sound for skirmishes',
                de: 'Spiele Pop-Sound ab für Scharmützel',
                fr: 'Jouer un son pour l\'apparition des escarmouches',
                ja: 'スカーミッシュ通知機能を有効にする',
                cn: '冲突战出现时播放提示音',
                ko: '돌발 교전 알림 소리 켜기',
            },
            type: 'checkbox',
            default: false,
        },
        {
            id: 'PopNoiseForCriticalEngagement',
            name: {
                en: 'Play pop sound for critical engagements',
                de: 'Spiele Pop-Sound ab für Kritische Gefechte',
                fr: 'Jouer un son pour l\'apparition des affrontement cruciaux',
                ja: 'CE通知機能を有効にする',
                cn: '紧急遭遇战(CE)出现时播放提示音',
                ko: '비상 교전(CE) 알림 소리 켜기',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'PopNoiseForDuel',
            name: {
                en: 'Play pop sound for duels',
                de: 'Spiele Pop-Sound ab für Duelle',
                fr: 'Jouer un son pour l\'apparition des duels',
                ja: '一騎打ち通知機能を有効にする',
                cn: '一对一决斗出现时播放提示音',
                ko: '결투 알림 소리 켜기',
            },
            type: 'checkbox',
            default: false,
        },
        {
            id: 'PopVolume',
            name: {
                en: 'Volume of the nm pop sound (0-1)',
                de: 'Lautstärke des Popsounds bei erscheinen eines NM (0-1)',
                fr: 'Volume du son d\'apparition d\'un NM (0-1)',
                ja: 'NM出現音量 (0-1)',
                cn: 'NM提示音量 (0-1)',
                ko: '돌발임무 등장 알림 소리 크기 (0-1)',
            },
            type: 'float',
            default: 1,
            setterFunc: (options, value) => {
                options['PopVolume'] = value;
            },
        },
        {
            id: 'BunnyPopVolume',
            name: {
                en: 'Volume of the bunny pop sound (0-1)',
                de: 'Lautstärke des Bunny Pop Sounds (0-1)',
                fr: 'Volume du son d\'apparition des lapins (0-1)',
                ja: 'しあわせうさぎ出現音量 (0-1)',
                cn: '幸福兔提示音量（0-1）',
                ko: '토끼 돌발 등장 알림 소리 크기 (0-1)',
            },
            type: 'float',
            default: 0.3,
            setterFunc: (options, value) => {
                options['BunnyPopVolume'] = value;
            },
        },
        {
            id: 'CriticalPopVolume',
            name: {
                en: 'Volume of the critical engagement pop sound (0-1)',
                de: 'Lautstärke des Kritischen Gefecht Sounds (0-1)',
                fr: 'Volume du son d\'apparition des affrontements cruciaux (0-1)',
                ja: 'CE通知音量 (0-1)',
                cn: 'critical engagement提示音量（0-1）',
                ko: '비상 교전(CE) 알림 소리 크기 (0-1)',
            },
            type: 'float',
            default: 0.3,
            setterFunc: (options, value) => {
                options['CriticalPopVolume'] = value;
            },
        },
        {
            id: 'RefreshRateSeconds',
            name: {
                en: 'Update rate of nm cooldowns (seconds)',
                de: 'Aktualisierung der NM cooldowns (in Sekunden)',
                fr: 'Rafraîchissement du temps de réapparition d\'un NM (s)',
                ja: 'NMの再沸き時間のリフレッシュ間隔 (秒)',
                cn: 'NM冷却时间刷新间隔 (秒)',
                ko: '돌발 소환가능시간 갱신 주기 (초)',
            },
            type: 'float',
            default: 1,
            setterFunc: (options, value) => {
                if (typeof value !== 'number')
                    return;
                options['RefreshRateMs'] = value * 1000;
            },
        },
    ],
});

;// CONCATENATED MODULE: ./ui/jobs/jobs_config.ts

user_config/* default.registerOptions */.Z.registerOptions('jobs', {
    options: [
        {
            id: 'JustBuffTracker',
            name: {
                en: 'Only show the party buff tracker',
                de: 'Zeige nur den Gruppen Buff-Tracker',
                fr: 'Afficher seulement le tracker de buff de l\'équipe',
                ja: 'シナジー効果のみを表示する',
                cn: '仅监控团辅技能',
                ko: '파티 버프만 표시',
            },
            type: 'checkbox',
            default: false,
        },
        {
            id: 'LowerOpacityOutOfCombat',
            name: {
                en: 'Lower ui opacity when out of combat',
                de: 'Veringere die Deckkraft auserhalb des Kampfes',
                fr: 'Diminiuer l\'opacité de l\'UI hors combat',
                ja: '非戦闘時にUIを透過する',
                cn: '非战斗状态时使UI半透明',
                ko: '전투 중이 아닐 때, UI 투명도 높이기',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'OpacityOutOfCombat',
            name: {
                en: 'Opacity of ui when out of combat',
                de: 'Deckkraft der UI auserhalb des Kampfes',
                fr: 'Opacité de l\'UI hors combat',
                ja: '非戦闘時のUI透過度',
                cn: '非战斗状态时的UI透明度',
                ko: '전투 중이 아닐 때, UI 투명도',
            },
            type: 'float',
            default: 0.5,
        },
        {
            id: 'PlayCountdownSound',
            name: {
                en: 'Enable countdown notification sound',
                de: 'Aktiviere Countdown Hinweis-Ton',
                fr: 'Activer la notification sonore du compte à rebours',
                ja: 'カウントダウンを音声で知らせる',
                cn: '启用倒计时提示音',
                ko: '초읽기 알림 소리 켜기',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'HideWellFedAboveSeconds',
            name: {
                en: 'Hide cheese icon when food > time (in seconds)',
                de: 'Verstecke das Käse Icon wenn Bufffood > Zeit (in Sekunden)',
                fr: 'Masquer l\'icône du fromage lorsque vous êtes repu > durée (en secondes)',
                ja: '飯効果の時間が不足したらチーズアイコンを表示する (秒)',
                cn: '食物 Buff 剩余时间不足警报 (秒)',
                ko: '남은 식사 효과 시간이 이 시간보다 길면, 치즈 아이콘 숨김 (단위: 초)',
            },
            type: 'integer',
            default: 15 * 60,
        },
        {
            id: 'ShowMPTickerOutOfCombat',
            name: {
                en: 'Show MP ticker out of combat',
                de: 'Zeige MP-Ticker auserhalb des Kampfes',
                fr: 'Afficher le symbole PM hors combat',
                ja: '非戦闘時にもMPを表示する',
                cn: '一直显示MP监控',
                ko: '전투 중이 아닐 때, MP 티커 표시',
            },
            type: 'checkbox',
            default: false,
        },
        {
            id: 'MidHealthThresholdPercent',
            name: {
                en: 'Percent of health considered middling',
                de: 'Prozent der Lebenspunkte (mittelmaß)',
                fr: 'Pourcentage de vie considéré comme moyenne',
                ja: '健康なHPとして扱うHP量 (1 = 100%)',
                cn: '中等血量阈值 (1 = 100%)',
                ko: '보통 HP로 취급될 HP비율 (1 = 100%)',
            },
            type: 'float',
            default: 0.8,
        },
        {
            id: 'LowHealthThresholdPercent',
            name: {
                en: 'Percent of health considered low',
                de: 'Prozent der Lebenspunkte (gering)',
                fr: 'Pourcentage de vie considéré comme bas',
                ja: '危険なHPとして扱うHP量 (1 = 100%)',
                cn: '危险血量阈值 (1 = 100%)',
                ko: '낮은 HP로 취급될 HP비율 (1 = 100%)',
            },
            type: 'float',
            default: 0.2,
        },
        {
            id: 'BigBuffShowCooldownSeconds',
            name: {
                en: 'Minimum seconds on a cooldown before shown',
                de: 'Minimum an Sekunden für einen Cooldown vor der Anzeige',
                fr: 'Nombre minimal de secondes avant l\'affichage du temps de recharge',
                ja: 'シナジースキルが使用可能前にアイコンを表示する (秒)',
                cn: '团辅冷却完成预告 (秒)',
                ko: '재사용 대기시간을 표시할 기준 시간(초 이하)',
            },
            type: 'float',
            default: 20,
        },
        {
            id: 'BigBuffIconWidth',
            name: {
                en: 'Width of buff icons (px)',
                de: 'Weite des Buff Icons (px)',
                fr: 'Largeur des icônes de buff (pixel)',
                ja: 'シナジースキルのアイコンの広さ (pixel)',
                cn: '团辅监控图标宽度 (像素)',
                ko: '버프 아이콘 너비 (pixel)',
            },
            type: 'integer',
            default: 44,
        },
        {
            id: 'BigBuffIconHeight',
            name: {
                en: 'Height of buff icons (px)',
                de: 'Höhe des Buff Icons (px)',
                fr: 'Hauteur des icônes de buff (pixel)',
                ja: 'シナジースキルのアイコンの高さ (pixel)',
                cn: '团辅监控图标高度 (像素)',
                ko: '버프 아이콘 높이 (pixel)',
            },
            type: 'integer',
            default: 32,
        },
        {
            id: 'BigBuffBarHeight',
            name: {
                en: 'Height of buff timer bars (px)',
                de: 'Höhe der Buff-Timer Leisten (px)',
                fr: 'Hauteur des barres de temps de buff (pixel)',
                ja: 'シナジースキルのタイムバーの高さ (pixel)',
                cn: '团辅监控计时条高度 (像素)',
                ko: '버프 타이머 바 높이 (pixel)',
            },
            type: 'integer',
            default: 5,
        },
        {
            id: 'BigBuffTextHeight',
            name: {
                en: 'Height of buff text (px)',
                de: 'Höhe des Buff-Text (px)',
                fr: 'Hauteur du texte de buff (pixel)',
                ja: 'シナジースキルのテキストの高さ (pixel)',
                cn: '团辅监控文字高度 (像素)',
                ko: '버프 텍스트 높이 (pixel)',
            },
            type: 'integer',
            default: 0,
        },
        {
            id: 'BigBuffBorderSize',
            name: {
                en: 'Size of buff borders (px)',
                de: 'Größe der Buff-Ränder (px)',
                fr: 'Taille des bordures de buff (pixel)',
                ja: 'シナジースキルのボーダーの広さ (pixel)',
                cn: '团辅监控边框尺寸 (像素)',
                ko: '버프 아이콘 테두리 크기 (pixel)',
            },
            type: 'integer',
            default: 1,
        },
        {
            id: 'GpAlarmPoint',
            name: {
                en: 'GP alarm threshold (0 to disable)',
                de: 'SP Alarm Grenze (0 to disable)',
                fr: 'Seuil d\'alarme PR (0 pour désactiver)',
                ja: 'GPが低い時に警告する (０＝無効)',
                cn: '低采集力提示阈值 (0为禁用)',
                ko: 'GP 알람 설정값 (0 = 기능 정지)',
            },
            type: 'integer',
            default: 0,
        },
        {
            id: 'GpAlarmSoundVolume',
            name: {
                en: 'GP alarm sound (0-1)',
                de: 'SP Alarm Sound (0-1)',
                fr: 'Son d\'alarme PR (0-1)',
                ja: '低いGPの警告音量 (0-1)',
                cn: '低采集力提示音量 (0-1)',
                ko: 'GP 알람 소리 크기 (0-1)',
            },
            type: 'float',
            default: 0.8,
        },
        {
            id: 'NotifyExpiredProcsInCombat',
            name: {
                en: 'Flash procs boxes of inactive dots/etc. up to n times while in combat. (-1: disabled, 0: infinite)',
                de: 'Dot/etc. boxen blinken bis zu n mal wenn im Kampf und dot ist nicht aktiv. (-1: deaktiviert, 0: ohne Limit)',
            },
            type: 'integer',
            default: -1,
        },
    ],
});

// EXTERNAL MODULE: ./ui/oopsyraidsy/data/oopsy_manifest.txt + 96 modules
var oopsy_manifest = __webpack_require__(400);
;// CONCATENATED MODULE: ./ui/oopsyraidsy/oopsyraidsy_config.js


const oopsyHelpers = ['damageWarn', 'damageFail', 'shareWarn', 'shareFail', 'gainsEffectWarn', 'gainsEffectFail']; // This could be a checkbox, but it's possible we could add more things here,
// like changing fail->warning or who knows what.

const kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
      de: '✔ Standards',
      fr: '✔ Défauts',
      ja: '✔ 初期設定',
      cn: '✔ 默认设置',
      ko: '✔ 기본'
    }
  },
  disabled: {
    label: {
      en: '❌ Disabled',
      de: '❌ Deaktiviert',
      fr: '❌ Désactivé',
      ja: '❌ 無効',
      cn: '❌ 禁用',
      ko: '❌ 비활성화'
    }
  }
};

class OopsyConfigurator {
  constructor(cactbotConfigurator) {
    this.base = cactbotConfigurator;
    this.lang = this.base.lang;
    this.optionKey = 'oopsyraidsy';
  }

  buildUI(container, files) {
    const fileMap = this.processOopsyFiles(files);
    const expansionDivs = {};

    for (const key in fileMap) {
      const info = fileMap[key];
      const expansion = info.prefix;
      if (info.triggers.length === 0) continue;

      if (!expansionDivs[expansion]) {
        const expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);
        const expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');

        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };

        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);
        expansionDivs[expansion] = expansionContainer;
      }

      const triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDivs[expansion].appendChild(triggerContainer);
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');

      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      const parts = [info.title, info.type, expansion];

      for (let i = 0; i < parts.length; ++i) {
        if (!parts[i]) continue;
        const partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = parts[i];
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);
      const triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const trigger of info.triggers) {
        // Build the trigger label.
        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trigger.id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv); // Container for the right side ui (select boxes, all of the info).

        const triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);
        triggerDetails.appendChild(this.buildTriggerOptions(trigger.id, triggerDiv));
      }
    }
  }

  buildTriggerOptions(id, labelDiv) {
    const kField = 'Output';
    const div = document.createElement('div');
    div.classList.add('trigger-options');

    const updateLabel = input => {
      if (input.value === 'hidden' || input.value === 'disabled') labelDiv.classList.add('disabled');else labelDiv.classList.remove('disabled');
    };

    const input = document.createElement('select');
    div.appendChild(input);
    const selectValue = this.base.getOption(this.optionKey, 'triggers', id, kField, 'default');

    for (const key in kTriggerOptions) {
      const elem = document.createElement('option');
      elem.innerHTML = this.base.translate(kTriggerOptions[key].label);
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);
      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.includes('default')) value = 'default';
        this.base.setOption(this.optionKey, 'triggers', id, kField, input.value);
      };
    }

    return div;
  }

  processOopsyFiles(files) {
    const map = this.base.processFiles(files);

    for (const [key, item] of Object.entries(map)) {
      item.triggers = [];
      const triggerSet = item.triggerSet;

      for (const prop of oopsyHelpers) {
        if (!triggerSet[prop]) continue;

        for (const id in triggerSet[prop]) item.triggers.push({
          id: id
        });
      }

      if (!triggerSet.triggers) continue;

      for (const trigger of triggerSet.triggers) {
        if (!trigger.id) continue; // Skip triggers that just set data.

        if (!trigger.mistake) continue;
        item.triggers.push(trigger);
      }
    }

    return map;
  }

}

user_config/* default.registerOptions */.Z.registerOptions('oopsyraidsy', {
  buildExtraUI: (base, container) => {
    const builder = new OopsyConfigurator(base);
    builder.buildUI(container, oopsy_manifest/* default */.Z);
  },
  processExtraOptions: (options, savedConfig) => {
    options['PerTriggerAutoConfig'] = options['PerTriggerAutoConfig'] || {};
    const triggers = savedConfig.triggers;
    if (!triggers) return;

    for (const id in triggers) {
      const output = triggers[id]['Output'];
      if (!output) continue;
      options['PerTriggerAutoConfig'][id] = {
        enabled: output !== 'disabled'
      };
    }
  },
  options: [{
    id: 'Debug',
    name: {
      en: 'Enable debug mode',
      de: 'Aktiviere Debugmodus',
      fr: 'Activer le mode debug',
      ja: 'デバッグモードを有効にする',
      cn: '启用调试模式',
      ko: '디버그 모드 활성화'
    },
    type: 'checkbox',
    debugOnly: true
  }, {
    id: 'NumLiveListItemsInCombat',
    name: {
      en: 'Number of mistakes to show in combat',
      de: 'Anzahl der Fehler, die während des Kampfes angezeigt werden',
      fr: 'Nombre de fautes à afficher en combat',
      ja: '戦闘中に表示するミスをした回数',
      cn: '战斗中显示的错误数量',
      ko: '전투 중 표시할 실수들의 개수'
    },
    type: 'integer',
    default: 5
  }, {
    id: 'MinimumTimeForPullMistake',
    name: {
      en: 'Minimum time to show early pull (seconds)',
      de: 'Minimum Zeit in der Early-Pulls angezeigt werden (in Sekunden)',
      fr: 'Durée minimale pour afficher l\'early pull (secondes)',
      ja: 'タゲ取るのが早かったら、ミスとして表示する、カウントダウンとの最短時間 (秒)',
      cn: '显示提前开怪最小时间 (秒)',
      ko: '풀링이 빠르다고 표시 할 최소 시간 (초)'
    },
    type: 'float',
    default: 0.4
  }]
});
;// CONCATENATED MODULE: ./ui/radar/radar_config.ts

user_config/* default.registerOptions */.Z.registerOptions('radar', {
    options: [
        {
            id: 'BRankEnabled',
            name: {
                en: 'B-Rank enabled',
                de: 'B-Rank aktiviert',
                fr: 'Rang-B activé',
                ja: 'ランクBモブ',
                cn: '开启B怪探测',
                ko: 'B랭크 표시',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'DetectionRange',
            name: {
                en: 'Minimum distance to detect mobs (yalms)',
                de: 'Minimum Entfernung um Mobs zu erkennen (in Yalms)',
                fr: 'Distance minimale de détection des mobs (yalms)',
                ja: '最短探測距離 (ヤルム)',
                cn: '最短探测距离 (米)',
                ko: '몬스터를 탐지할 최소 거리 (미터)',
            },
            type: 'float',
            default: 0,
        },
        {
            id: 'TTS',
            name: {
                en: 'Announce new mobs with text to speech',
                de: 'Kündige neue Mobs mit TTS an',
                fr: 'Annoncer les nouveaux mobs via TTS',
                ja: '沸きモブを探知したらTTSで知らせる',
                cn: '使用TTS提醒新发现目标',
                ko: '새 몬스터를 TTS로 알림',
            },
            type: 'checkbox',
            default: false,
        },
        {
            id: 'PopSoundAlert',
            name: {
                en: 'Announce new mobs with a sound',
                de: 'Kündige neue Mobs mit einem Sound an',
                fr: 'Annoncer les nouveaux mobs avec un son',
                ja: '沸きモブを探知したら音声で知らせる',
                cn: '使用预设提示音提醒新发现目标',
                ko: '새 몬스터를 소리로 알림',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'PopVolume',
            name: {
                en: 'Volume to play pop sound (0-1)',
                de: 'Lautstärke für den Popsound (0-1)',
                fr: 'Volume du son lors d\'une apparition (0-1)',
                ja: 'お知らせ音声の音量 (0-1)',
                cn: '提示音的音量 (0-1)',
                ko: '소리 크기 (0-1)',
            },
            type: 'float',
            default: 0.5,
        },
        {
            id: 'Puller',
            name: {
                en: 'Show puller of mob',
                de: 'Zeige den ersten Angreifer eines Mobs an',
                fr: 'Afficher le puller du mob',
                ja: '最初にタゲ取った人の名前を表示',
                cn: '显示目标开怪者的名称',
                ko: '몬스터를 풀링한 사람 표시',
            },
            type: 'checkbox',
            default: true,
        },
        {
            id: 'Position',
            name: {
                en: 'Show position of mob',
                de: 'Zeige die Position eines Mobs',
                fr: 'Afficher la position du mob',
                ja: '沸きモブの位置を表示',
                cn: '显示目标位置',
                ko: '몬스터의 위치 표시',
            },
            type: 'checkbox',
            default: true,
        },
    ],
});

// EXTERNAL MODULE: ./resources/util.ts
var util = __webpack_require__(779);
;// CONCATENATED MODULE: ./resources/party.ts

const emptyRoleToPartyNames = () => {
    return {
        tank: [],
        healer: [],
        dps: [],
        crafter: [],
        gatherer: [],
        none: [],
    };
};
class PartyTracker {
    constructor() {
        this.details = [];
        this.partyNames_ = [];
        this.partyIds_ = [];
        this.allianceNames_ = [];
        this.allianceIds_ = [];
        this.nameToRole_ = {};
        this.idToName_ = {};
        this.roleToPartyNames_ = emptyRoleToPartyNames();
    }
    // Bind this to PartyChanged events.
    onPartyChanged(e) {
        if (!e || !e.party)
            return;
        this.reset();
        this.details = e.party;
        for (const p of e.party) {
            this.allianceIds_.push(p.id);
            this.allianceNames_.push(p.name);
            const jobName = util/* default.jobEnumToJob */.Z.jobEnumToJob(p.job);
            const role = util/* default.jobToRole */.Z.jobToRole(jobName);
            this.idToName_[p.id] = p.name;
            this.nameToRole_[p.name] = role;
            if (p.inParty) {
                this.partyIds_.push(p.id);
                this.partyNames_.push(p.name);
                this.roleToPartyNames_[role].push(p.name);
            }
        }
    }
    reset() {
        // original event data
        this.details = [];
        this.partyNames_ = [];
        this.partyIds_ = [];
        this.allianceNames_ = [];
        this.allianceIds_ = [];
        this.nameToRole_ = {};
        this.idToName_ = {};
        // role -> [names] but only for party
        this.roleToPartyNames_ = emptyRoleToPartyNames();
    }
    // returns an array of the names of players in your immediate party
    get partyNames() {
        return this.partyNames_;
    }
    get partyIds() {
        return this.partyIds_;
    }
    // returns an array of the names of players in your alliance
    get allianceNames() {
        return this.allianceNames_;
    }
    // returns an array of the names of tanks in your immediate party
    get tankNames() {
        return this.roleToPartyNames_['tank'];
    }
    // returns an array of the names of healers in your immediate party
    get healerNames() {
        return this.roleToPartyNames_['healer'];
    }
    // returns an array of the names of dps players in your immediate party
    get dpsNames() {
        return this.roleToPartyNames_['dps'];
    }
    // returns true if the named player in your alliance is a particular role
    isRole(name, role) {
        return this.nameToRole_[name] === role;
    }
    // returns true if the named player in your alliance is a tank
    isTank(name) {
        return this.isRole(name, 'tank');
    }
    // returns true if the named player in your alliance is a healer
    isHealer(name) {
        return this.isRole(name, 'healer');
    }
    // returns true if the named player in your alliance is a dps
    isDPS(name) {
        return this.isRole(name, 'dps');
    }
    // returns true if the named player is in your immediate party
    inParty(name) {
        return this.partyNames.includes(name);
    }
    // returns true if the named player is in your alliance
    inAlliance(name) {
        return this.allianceNames.includes(name);
    }
    // for a named player, returns the other tank in your immediate party
    // if named player is not a tank, or there's not exactly two tanks
    // in your immediate party, returns null.
    otherTank(name) {
        const names = this.tankNames;
        if (names.length !== 2)
            return;
        if (names[0] === name)
            return names[1];
        if (names[1] === name)
            return names[0];
    }
    // see: otherTank, but for healers.
    otherHealer(name) {
        const names = this.roleToPartyNames_['healer'];
        if (names.length !== 2)
            return;
        if (names[0] === name)
            return names[1];
        if (names[1] === name)
            return names[0];
    }
    // returns the job name of the specified party member
    jobName(name) {
        var _a;
        const partyIndex = this.partyNames.indexOf(name);
        if (partyIndex >= 0)
            return util/* default.jobEnumToJob */.Z.jobEnumToJob((_a = this.details[partyIndex]) === null || _a === void 0 ? void 0 : _a.job);
    }
    nameFromId(id) {
        return this.idToName_[id];
    }
}

// EXTERNAL MODULE: ./resources/responses.ts
var responses = __webpack_require__(163);
// EXTERNAL MODULE: ./ui/raidboss/data/raidboss_manifest.txt + 328 modules
var raidboss_manifest = __webpack_require__(484);
;// CONCATENATED MODULE: ./ui/raidboss/raidboss_options.ts

// These options are ones that are not auto-defined by raidboss_config.js.
const defaultRaidbossNonConfigOptions = {
    PlayerNicks: {},
    InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
    AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
    AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
    LongSound: '../../resources/sounds/BigWigs/Long.ogg',
    PullSound: '../../resources/sounds/freesound/sonar.ogg',
    AudioAllowed: true,
    DisabledTriggers: {},
    PerTriggerAutoConfig: {},
    PerTriggerOptions: {},
    Triggers: [],
    IsRemoteRaidboss: false,
    TransformTts: (t) => t,
};
// TODO: figure out how to get this type from raidboss_config??
// These values are overwritten and are just here for typing.
const defaultRaidbossConfigOptions = {
    Debug: false,
    DefaultAlertOutput: 'textAndSound',
    AlertsLanguage: undefined,
    TimelineLanguage: undefined,
    TimelineEnabled: true,
    AlertsEnabled: true,
    ShowTimerBarsAtSeconds: 30,
    KeepExpiredTimerBarsForSeconds: 0.7,
    BarExpiresSoonSeconds: 6,
    MaxNumberOfTimerBars: 6,
    DisplayAlarmTextForSeconds: 3,
    DisplayAlertTextForSeconds: 3,
    DisplayInfoTextForSeconds: 3,
    AlarmSoundVolume: 1,
    AlertSoundVolume: 1,
    InfoSoundVolume: 1,
    LongSoundVolume: 1,
    PullSoundVolume: 1,
    cactbotWormholeStrat: false,
    cactbote8sUptimeKnockbackStrat: false,
};
// See user/raidboss-example.js for documentation.
const Options = {
    ...user_config/* default.getDefaultBaseOptions */.Z.getDefaultBaseOptions(),
    ...defaultRaidbossNonConfigOptions,
    ...defaultRaidbossConfigOptions,
};
/* harmony default export */ const raidboss_options = (Options);

;// CONCATENATED MODULE: ./ui/raidboss/raidboss_config.js







const kOptionKeys = {
  output: 'Output',
  duration: 'Duration',
  beforeSeconds: 'BeforeSeconds',
  outputStrings: 'OutputStrings'
}; // No sound only option, because that's silly.

const raidboss_config_kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
      de: '✔ Standards',
      fr: '✔ Défauts',
      ja: '✔ 初期設定',
      cn: '✔ 默认设置',
      ko: '✔ 기본'
    }
  },
  textAndSound: {
    label: {
      en: '🆙🔊 Text and Sound',
      de: '🆙🔊 Text und Ton',
      fr: '🆙🔊 Texte et son',
      ja: '🆙🔊 テキストと音声',
      cn: '🆙🔊 文字显示与提示音',
      ko: '🆙🔊 텍스트와 소리'
    }
  },
  ttsAndText: {
    label: {
      en: '🆙💬 Text and TTS',
      de: '🆙💬 Text und TTS',
      fr: '🆙💬 Texte et TTS',
      ja: '🆙💬 テキストとTTS',
      cn: '🆙💬 文字显示与TTS',
      ko: '🆙💬 텍스트와 TTS'
    }
  },
  ttsOnly: {
    label: {
      en: '💬 TTS Only',
      de: '💬 Nur TTS',
      fr: '💬 TTS Seulement',
      ja: '💬 TTSのみ',
      cn: '💬 只使用TTS',
      ko: '💬 TTS만'
    }
  },
  textOnly: {
    label: {
      en: '🆙 Text Only',
      de: '🆙 Nur Text',
      fr: '🆙 Texte seulement',
      ja: '🆙 テキストのみ',
      cn: '🆙 只使用文字显示',
      ko: '🆙 텍스트만'
    }
  },
  disabled: {
    label: {
      en: '❌ Disabled',
      de: '❌ Deaktiviert',
      fr: '❌ Désactivé',
      ja: '❌ 無効',
      cn: '❌ 禁用',
      ko: '❌ 비활성화'
    }
  }
};
const kDetailKeys = {
  'triggerRegex': {
    label: {
      en: 'regex',
      de: 'regex',
      fr: 'regex',
      ja: '正規表現',
      cn: '正则表达式',
      ko: '정규식'
    },
    cls: 'regex-text',
    debugOnly: true
  },
  'triggerNetRegex': {
    label: {
      en: 'netregex',
      de: 'netregex',
      fr: 'netregex',
      ja: 'ネット正規表現',
      cn: '网络日志正则表达式'
    },
    cls: 'regex-text',
    debugOnly: true
  },
  'timelineRegex': {
    label: {
      en: 'timeline',
      de: 'timeline',
      fr: 'timeline',
      ja: 'タイムライン',
      cn: '时间轴',
      ko: '타임라인'
    },
    cls: 'regex-text',
    debugOnly: true
  },
  'beforeSeconds': {
    label: {
      en: 'before (sec)',
      de: 'Vorher (Sekunden)',
      fr: 'avant (seconde)',
      ja: 'その前に (秒)',
      cn: '提前 (秒)',
      ko: '앞당김 (초)'
    },
    cls: 'before-seconds-text',
    generatedManually: true
  },
  'condition': {
    label: {
      en: 'condition',
      de: 'condition',
      fr: 'condition',
      ja: '条件',
      cn: '条件',
      ko: '조건'
    },
    cls: 'condition-text',
    debugOnly: true
  },
  'duration': {
    label: {
      en: 'duration (sec)',
      de: 'Dauer (Sekunden)',
      fr: 'Durée (secondes)',
      ja: '存続時間 (秒)',
      cn: '持续时间 (秒)',
      ko: '지속 시간 (초)'
    },
    cls: 'duration-text',
    generatedManually: true
  },
  'preRun': {
    label: {
      en: 'preRun',
      de: 'preRun',
      fr: 'preRun',
      ja: 'プレ実行',
      cn: '预运行',
      ko: '사전 실행'
    },
    cls: 'prerun-text',
    debugOnly: true
  },
  'alarmText': {
    label: {
      en: 'alarm',
      de: 'alarm',
      fr: 'alarme',
      ja: '警報',
      cn: '警报文本',
      ko: '경고'
    },
    cls: 'alarm-text'
  },
  'alertText': {
    label: {
      en: 'alert',
      de: 'alert',
      fr: 'alerte',
      ja: '警告',
      cn: '警告文本',
      ko: '주의'
    },
    cls: 'alert-text'
  },
  'infoText': {
    label: {
      en: 'info',
      de: 'info',
      fr: 'info',
      ja: '情報',
      cn: '信息文本',
      ko: '안내'
    },
    cls: 'info-text'
  },
  'tts': {
    label: {
      en: 'tts',
      de: 'tts',
      fr: 'tts',
      ja: 'TTS',
      cn: 'TTS',
      ko: 'TTS'
    },
    cls: 'tts-text'
  },
  'sound': {
    label: {
      en: 'sound',
      de: 'sound',
      fr: 'son',
      ja: '音声',
      cn: '提示音',
      ko: '소리'
    },
    cls: 'sound-text'
  },
  'run': {
    label: {
      en: 'run',
      de: 'run',
      fr: 'run',
      ja: '実行',
      cn: '运行',
      ko: '실행'
    },
    cls: 'run-text',
    debugOnly: true
  }
};
const kMiscTranslations = {
  // Shows up for un-set values.
  valueDefault: {
    en: '(default)',
    de: '(Standard)',
    fr: '(Défaut)',
    ja: '(初期値)',
    cn: '(默认值)',
    ko: '(기본값)'
  },
  // Shown when the UI can't decipher the output of a function.
  valueIsFunction: {
    en: '(function)',
    de: '(Funktion)',
    fr: '(Fonction)',
    ja: '(関数)',
    cn: '(函数)',
    ko: '(함수)'
  },
  // Warning label for triggers without ids or overridden triggers.
  warning: {
    en: '⚠️ warning',
    de: '⚠️ Warnung',
    fr: '⚠️ Attention',
    ja: '⚠️ 警告',
    cn: '⚠️ 警告',
    ko: '⚠️ 주의'
  },
  // Shows up for triggers without ids.
  missingId: {
    en: 'missing id field',
    de: 'Fehlendes ID Feld',
    fr: 'Champ ID manquant',
    ja: 'idがありません',
    cn: '缺少id属性',
    ko: 'ID 필드값 없음'
  },
  // Shows up for triggers that are overridden by other triggers.
  overriddenByFile: {
    en: 'overridden by "${file}"',
    de: 'Überschrieben durch "${file}"',
    fr: 'Écrasé(e) par "${file}"',
    ja: '"${file}"に上書きました',
    cn: '被"${file}"文件覆盖',
    ko: '"${file}" 파일에서 덮어씌움'
  },
  // Opens trigger file on Github.
  viewTriggerSource: {
    en: 'View Trigger Source',
    de: 'Zeige Trigger Quelle',
    ja: 'トリガーのコードを表示',
    cn: '显示触发器源码',
    ko: '트리거 출처 열기'
  }
};

const validDurationOrUndefined = val => {
  val = parseFloat(val);
  if (!isNaN(val) && val >= 0) return val;
  return undefined;
};

const canBeConfigured = trig => !trig.isMissingId && !trig.overriddenByFile;

const addTriggerDetail = (container, labelText, detailText, detailCls) => {
  const label = document.createElement('div');
  label.innerText = labelText;
  label.classList.add('trigger-label');
  container.appendChild(label);
  const detail = document.createElement('div');
  detail.classList.add('trigger-detail');
  detail.innerText = detailText;
  container.appendChild(detail);
  if (detailCls) detail.classList.add(detailCls);
}; // This is used both for top level Options and for PerTriggerAutoConfig settings.
// Unfortunately due to poor decisions in the past, PerTriggerOptions has different
// fields here.  This should be fixed.


function setOptionsFromOutputValue(options, value) {
  if (value === 'default') {// Nothing.
  } else if (value === 'textAndSound') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = false;
  } else if (value === 'ttsAndText') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = true;
  } else if (value === 'ttsOnly') {
    options.TextAlertsEnabled = false;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = true;
  } else if (value === 'textOnly') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = false;
    options.SpokenAlertsEnabled = false;
  } else if (value === 'disabled') {
    options.TextAlertsEnabled = false;
    options.SoundAlertsEnabled = false;
    options.SpokenAlertsEnabled = false;
  } else {
    console.error('unknown output type: ' + value);
  }
} // Helper for doing nothing during trigger eval, but still recording any
// calls to `output.responseOutputStrings = x;` via callback.


class DoNothingFuncProxy {
  constructor(outputStringsCallback) {
    return new Proxy(this, {
      set(target, property, value) {
        if (property === 'responseOutputStrings') {
          outputStringsCallback(value);
          return true;
        } // Ignore other property setting here.

      },

      get(target, name) {
        return () => {};
      }

    });
  }

}

class RaidbossConfigurator {
  constructor(cactbotConfigurator) {
    this.base = cactbotConfigurator; // TODO: is it worth adding the complexity to reflect this change in triggers that use it?
    // This is probably where using something like vue or react would be easier.
    // For the moment, folks can just reload, for real.

    this.alertsLang = this.base.getOption('raidboss', 'AlertsLanguage', this.base.lang);
    this.timelineLang = this.base.getOption('raidboss', 'TimelineLanguage', this.base.lang);
  }

  buildUI(container, raidbossFiles, userOptions) {
    const fileMap = this.processRaidbossFiles(raidbossFiles, userOptions);
    const expansionDivs = {};

    for (const key in fileMap) {
      const info = fileMap[key]; // "expansion" here is technically section, which includes "general triggers"
      // and one section per user file.

      const expansion = info.section;
      if (Object.keys(info.triggers).length === 0) continue;

      if (!expansionDivs[expansion]) {
        const expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);
        const expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');

        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };

        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);
        expansionDivs[expansion] = expansionContainer;
      }

      const triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDivs[expansion].appendChild(triggerContainer);
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');

      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      const parts = [info.title, info.type, info.prefix];

      for (let i = 0; i < parts.length; ++i) {
        if (!parts[i]) continue;
        const partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = parts[i];
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);
      const triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const id in info.triggers) {
        const trig = info.triggers[id]; // Don't construct triggers that won't show anything.

        let hasOutputFunc = false;

        for (const func of responses/* triggerOutputFunctions */.ug) {
          if (trig[func]) {
            hasOutputFunc = true;
            break;
          }
        }

        if (!hasOutputFunc && !this.base.developerOptions) continue; // Build the trigger label.

        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trig.isMissingId ? '(???)' : trig.id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv); // Container for the right side ui (select boxes, all of the info).

        const triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);
        if (canBeConfigured(trig)) triggerDetails.appendChild(this.buildTriggerOptions(trig, triggerDiv));

        if (trig.isMissingId) {
          addTriggerDetail(triggerDetails, this.base.translate(kMiscTranslations.warning), this.base.translate(kMiscTranslations.missingId));
        }

        if (trig.overriddenByFile) {
          const baseText = this.base.translate(kMiscTranslations.overriddenByFile);
          const detailText = baseText.replace('${file}', trig.overriddenByFile);
          addTriggerDetail(triggerDetails, this.base.translate(kMiscTranslations.warning), detailText);
        } // Append some details about the trigger so it's more obvious what it is.


        for (const detailKey in kDetailKeys) {
          if (kDetailKeys[detailKey].generatedManually) continue;
          if (!this.base.developerOptions && kDetailKeys[detailKey].debugOnly) continue;
          if (!trig[detailKey] && !trig.output[detailKey]) continue;
          const detailCls = [kDetailKeys[detailKey].cls];
          let detailText;

          if (trig.output[detailKey]) {
            detailText = trig.output[detailKey];
          } else if (typeof trig[detailKey] === 'function') {
            detailText = this.base.translate(kMiscTranslations.valueIsFunction);
            detailCls.push('function-text');
          } else {
            detailText = trig[detailKey];
          }

          addTriggerDetail(triggerDetails, this.base.translate(kDetailKeys[detailKey].label), detailText, detailCls);
        }

        if (!canBeConfigured(trig)) continue; // Add beforeSeconds manually for timeline triggers.

        if (trig.isTimelineTrigger) {
          const detailKey = 'beforeSeconds';
          const optionKey = kOptionKeys.beforeSeconds;
          const label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-before-seconds');
          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.step = 'any'; // Say "(default)" for more complicated things like functions.

          let defaultValue = kMiscTranslations.valueDefault;
          if (trig.beforeSeconds === undefined) defaultValue = 0;else if (typeof trig.beforeSeconds === 'number') defaultValue = trig.beforeSeconds;
          input.placeholder = this.base.translate(defaultValue);
          input.value = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, '');

          const setFunc = () => {
            const val = validDurationOrUndefined(input.value) || '';
            this.base.setOption('raidboss', 'triggers', trig.id, optionKey, val);
          };

          input.onchange = setFunc;
          input.oninput = setFunc;
          triggerDetails.appendChild(div);
        } // Add duration manually with an input to override.


        if (hasOutputFunc) {
          const detailKey = 'duration';
          const optionKey = kOptionKeys.duration;
          const label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-duration');
          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.step = 'any';
          input.placeholder = this.base.translate(kMiscTranslations.valueDefault);
          input.value = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, '');

          const setFunc = () => {
            const val = validDurationOrUndefined(input.value) || '';
            this.base.setOption('raidboss', 'triggers', trig.id, optionKey, val);
          };

          input.onchange = setFunc;
          input.oninput = setFunc;
          triggerDetails.appendChild(div);
        } // Add output strings manually


        const outputStrings = trig.outputStrings || {};

        for (const key in outputStrings) {
          const optionKey = kOptionKeys.outputStrings;
          const template = this.base.translate(outputStrings[key]);
          const label = document.createElement('div');
          label.innerText = key;
          label.classList.add('trigger-outputstring-label');
          triggerDetails.appendChild(label);
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-outputstring');
          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.placeholder = template;
          input.value = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, key, '');

          const setFunc = () => this.base.setOption('raidboss', 'triggers', trig.id, optionKey, key, input.value);

          input.onchange = setFunc;
          input.oninput = setFunc;
          triggerDetails.appendChild(div);
        }

        const label = document.createElement('div');
        triggerDetails.appendChild(label);
        const div = document.createElement('div');
        div.classList.add('option-input-container', 'trigger-source');
        const baseUrl = 'https://github.com/quisquous/cactbot/blob/triggers';
        const path = key.split('-');
        let urlFilepath;

        if (path.length === 3) {
          // 00-misc/general.js
          urlFilepath = `${path[0]}-${path[1]}/${[...path].slice(2).join('-')}`;
        } else {
          // 02-arr/raids/t1.js
          urlFilepath = `${path[0]}-${path[1]}/${path[2]}/${[...path].slice(3).join('-')}`;
        }

        const escapedTriggerId = trig.id.replace(/'/g, '\\\'');
        const uriComponent = encodeURIComponent(`id: '${escapedTriggerId}'`).replace(/'/g, '%27');
        const urlString = `${baseUrl}/${urlFilepath}.js#:~:text=${uriComponent}`;
        div.innerHTML = `<a href="${urlString}" target="_blank">(${this.base.translate(kMiscTranslations.viewTriggerSource)})</a>`;
        triggerDetails.appendChild(div);
      }
    }
  } // This duplicates the raidboss function of the same name.


  valueOrFunction(f, data, matches, output) {
    const result = typeof f === 'function' ? f(data, matches, output) : f;
    if (result !== Object(result)) return result;
    if (result[this.alertsLang]) return this.valueOrFunction(result[this.alertsLang]);
    if (result[this.timelineLang]) return this.valueOrFunction(result[this.timelineLang]); // For partially localized results where this localization doesn't
    // exist, prefer English over nothing.

    return this.valueOrFunction(result['en']);
  }

  processTrigger(trig) {
    // TODO: with some hackiness (e.g. regexes?) we could figure out which
    // output string came from which alert type (alarm, alert, info, tts).
    trig.output = new DoNothingFuncProxy(outputStrings => {
      trig.outputStrings = trig.outputStrings || {};
      Object.assign(trig.outputStrings, outputStrings);
    });
    const kBaseFakeData = {
      party: new PartyTracker(),
      lang: this.base.lang,
      currentHP: 1000,
      options: this.base.configOptions,
      ShortName: x => x,
      StopCombat: () => {},
      ParseLocaleFloat: parseFloat,
      CanStun: () => util/* default.canStun */.Z.canStun(this.job),
      CanSilence: () => util/* default.canSilence */.Z.canSilence(this.job),
      CanSleep: () => util/* default.canSleep */.Z.canSleep(this.job),
      CanCleanse: () => util/* default.canCleanse */.Z.canCleanse(this.job),
      CanFeint: () => util/* default.canFeint */.Z.canFeint(this.job),
      CanAddle: () => util/* default.canAddle */.Z.canAddle(this.job)
    };
    const kFakeData = [{
      me: 'Tini Poutini',
      job: 'GNB',
      role: 'tank'
    }, {
      me: 'Potato Chippy',
      job: 'WHM',
      role: 'healer'
    }, {
      me: 'Tater Tot',
      job: 'BLM',
      role: 'dps'
    }, {
      me: 'Hash Brown',
      job: 'DRG',
      role: 'dps'
    }, {
      me: 'Aloo Gobi',
      job: 'BLU',
      role: 'dps'
    }];

    for (let i = 0; i < kFakeData.length; ++i) kFakeData[i] = Object.assign({}, kFakeData[i], kBaseFakeData);

    const kFakeMatches = {
      // TODO: really should convert all triggers to use regexes.js.
      // Mooooost triggers use matches[1] to be a name.
      1: kFakeData[0].me,
      sourceId: '41234567',
      source: 'Enemy',
      id: '1234',
      ability: 'Ability',
      targetId: '1234567',
      target: kFakeData[0].me,
      flags: '',
      x: 100,
      y: 100,
      z: 0,
      heading: 0,
      npcId: undefined,
      effect: 'Effect',
      duration: 30,
      code: '00',
      line: '',
      name: 'Name',
      capture: true
    };
    const output = {};
    const keys = ['alarmText', 'alertText', 'infoText', 'tts', 'sound']; // Try to determine some sample output?
    // This could get much more complicated if we wanted it to.

    const evalTrigger = (trig, key, idx) => {
      try {
        const result = this.valueOrFunction(trig[key], kFakeData[idx], kFakeMatches, trig.output);
        if (!result) return false; // Super hack:

        if (result.includes('undefined') || result.includes('NaN')) return false;
        output[key] = result;
        return true;
      } catch (e) {
        // This is all totally bogus.  Many triggers assume fields on data
        // are properly defined when these calls happen, so will throw errors.
        // So just silently ignore.
        return false;
      }
    }; // Handle 'response' first.


    if (trig.response) {
      const r = trig.response;

      for (let d = 0; d < kFakeData.length; ++d) {
        try {
          // Can't use ValueOrFunction here as r returns a non-localizable object.
          // FIXME: this hackily replicates some raidboss logic too.
          let response = r;

          while (typeof response === 'function') {
            // TODO: check if this has builtInResponseStr first.
            response = response(kFakeData[d], kFakeMatches, trig.output);
          }

          if (!response) continue;

          if (!trig.outputStrings) {
            for (const key of keys) evalTrigger(response, key, d);
          }

          break;
        } catch (e) {
          continue;
        }
      }
    } // Only evaluate fields if there are not outputStrings.
    // outputStrings will indicate more clearly what the trigger says.


    if (!trig.outputStrings) {
      for (const key of keys) {
        if (!trig[key]) continue;

        for (let d = 0; d < kFakeData.length; ++d) {
          if (evalTrigger(trig, key, d)) break;
        }
      }
    }

    trig.output = output;
    const lang = this.base.lang;

    const getRegex = baseField => {
      const shortLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
      const langSpecificRegex = trig[baseField + shortLanguage] || trig[baseField];
      if (!langSpecificRegex) return;
      const baseRegex = regexes/* default.parse */.Z.parse(langSpecificRegex);
      if (!baseRegex) return;
      return regexes/* default.parse */.Z.parse(baseRegex);
    };

    if (trig.isTimelineTrigger) {
      trig.timelineRegex = getRegex('regex');
    } else {
      trig.triggerRegex = getRegex('regex');
      trig.triggerNetRegex = getRegex('netRegex');
    }

    return trig;
  }

  processRaidbossFiles(files, userOptions) {
    // `files` is map of filename => triggerSet (for trigger files)
    // `map` is a sorted map of shortened zone key => { various fields, triggerSet }
    const map = this.base.processFiles(files, userOptions.Triggers);
    let triggerIdx = 0; // While walking through triggers, record any previous triggers with the same
    // id so that the ui can disable overriding information.

    const previousTriggerWithId = {};

    for (const item of Object.values(map)) {
      // TODO: maybe each trigger set needs a zone name, and we should
      // use that instead of the filename???
      const rawTriggers = {
        trigger: [],
        timeline: []
      };
      const triggerSet = item.triggerSet;
      if (triggerSet.triggers) rawTriggers.trigger.push(...triggerSet.triggers);
      if (triggerSet.timelineTriggers) rawTriggers.timeline.push(...triggerSet.timelineTriggers);
      item.triggers = {};

      for (const key in rawTriggers) {
        for (const trig of rawTriggers[key]) {
          triggerIdx++;

          if (!trig.id) {
            // Give triggers with no id some "unique" string so that they can
            // still be added to the set and show up in the ui.
            trig.id = `!!NoIdTrigger${triggerIdx}`;
            trig.isMissingId = true;
          } // Track if this trigger overrides any previous trigger.


          const previous = previousTriggerWithId[trig.id];
          if (previous) previous.overriddenByFile = triggerSet.filename;
          previousTriggerWithId[trig.id] = trig;
          trig.isTimelineTrigger = key === 'timeline'; // Also, if a user has two of the same id in the same triggerSet (?!)
          // then only the second trigger will show up.

          item.triggers[trig.id] = this.processTrigger(trig);
        }
      }
    }

    return map;
  }

  buildTriggerOptions(trig, labelDiv) {
    const optionKey = kOptionKeys.output;
    const div = document.createElement('div');
    div.classList.add('trigger-options');

    const updateLabel = input => {
      if (input.value === 'hidden' || input.value === 'disabled') labelDiv.classList.add('disabled');else labelDiv.classList.remove('disabled');
    };

    const input = document.createElement('select');
    div.appendChild(input);
    const selectValue = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, 'default');

    for (const key in raidboss_config_kTriggerOptions) {
      // Hide debug only options unless they are selected.
      // Otherwise, it will look weird to pick something like 'Disabled',
      // but then not show it when developer options are turned off.
      if (!this.base.developerOptions && raidboss_config_kTriggerOptions[key].debugOnly && key !== selectValue) continue;
      const elem = document.createElement('option');
      elem.innerHTML = this.base.translate(raidboss_config_kTriggerOptions[key].label);
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);
      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.includes('default')) value = 'default';
        this.base.setOption('raidboss', 'triggers', trig.id, optionKey, input.value);
      };
    }

    return div;
  }

} // Raidboss needs to do some extra processing of user files.


const userFileHandler = (name, files, options, basePath) => {
  if (!options.Triggers) return;

  for (const set of options.Triggers) {
    // Annotate triggers with where they came from.  Note, options is passed in repeatedly
    // as multiple sets of user files add triggers, so only process each file once.
    if (set.isUserTriggerSet) continue; // `filename` here is just cosmetic for better debug printing to make it more clear
    // where a trigger or an override is coming from.

    set.filename = `${basePath}${name}`;
    set.isUserTriggerSet = true; // Convert set.timelineFile to set.timeline.

    if (set.timelineFile) {
      const lastIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\')); // If lastIndex === -1, truncate name to the empty string.
      // if lastIndex > -1, truncate name after the final slash.

      const dir = name.substring(0, lastIndex + 1);
      const timelineFile = `${dir}${set.timelineFile}`;
      delete set.timelineFile;

      if (!(timelineFile in files)) {
        console.log(`ERROR: '${name}' specifies non-existent timeline file '${timelineFile}'.`);
        continue;
      } // set.timeline is processed recursively.


      set.timeline = [set.timeline, files[timelineFile]];
    }
  }
};

const templateOptions = {
  buildExtraUI: (base, container) => {
    const builder = new RaidbossConfigurator(base);
    const userOptions = { ...raidboss_options
    };
    user_config/* default.loadUserFiles */.Z.loadUserFiles('raidboss', userOptions, () => {
      builder.buildUI(container, raidboss_manifest/* default */.Z, userOptions);
    });
  },
  processExtraOptions: (options, savedConfig) => {
    // raidboss will look up this.options.PerTriggerAutoConfig to find these values.
    const optionName = 'PerTriggerAutoConfig';
    options[optionName] = options[optionName] || {};
    const triggers = savedConfig.triggers;
    if (!triggers) return;
    const perTrigger = options[optionName];
    const outputObjs = {};
    const keys = Object.keys(raidboss_config_kTriggerOptions);

    for (const key of keys) {
      outputObjs[key] = {};
      setOptionsFromOutputValue(outputObjs[key], key);
    }

    for (const id in triggers) {
      const autoConfig = {};
      const output = triggers[id][kOptionKeys.output];
      if (output) Object.assign(autoConfig, outputObjs[output]);
      const duration = validDurationOrUndefined(triggers[id][kOptionKeys.duration]);
      if (duration) autoConfig[kOptionKeys.duration] = duration;
      const beforeSeconds = validDurationOrUndefined(triggers[id][kOptionKeys.beforeSeconds]);
      if (beforeSeconds) autoConfig[kOptionKeys.beforeSeconds] = beforeSeconds;
      const outputStrings = triggers[id][kOptionKeys.outputStrings];
      if (outputStrings) autoConfig[kOptionKeys.outputStrings] = outputStrings;
      if (output || duration || outputStrings) perTrigger[id] = autoConfig;
    }
  },
  options: [{
    id: 'Debug',
    name: {
      en: 'Enable debug mode',
      de: 'Aktiviere Debugmodus',
      fr: 'Activer le mode debug',
      ja: 'デバッグモードを有効にする',
      cn: '启用调试模式',
      ko: '디버그 모드 활성화'
    },
    type: 'checkbox',
    debugOnly: true
  }, {
    id: 'DefaultAlertOutput',
    name: {
      en: 'Default alert output',
      de: 'Standard Alert Ausgabe',
      fr: 'Alerte par défaut',
      ja: '警告情報出力既定値',
      cn: '默认警报提示信息输出方式',
      ko: '기본 알람 출력 방식'
    },
    type: 'select',
    options: {
      en: {
        '🆙🔊 Text and Sound': 'textAndSound',
        '🆙💬 Text and TTS': 'ttsAndText',
        '💬 TTS Only': 'ttsOnly',
        '🆙 Text Only': 'textOnly',
        '❌ Disabled': 'disabled'
      },
      de: {
        '🆙🔊 Text und Ton': 'textAndSound',
        '🆙💬 Text und TTS': 'ttsAndText',
        '💬 Nur TTS': 'ttsOnly',
        '🆙 Nur Text': 'textOnly',
        '❌ Deaktiviert': 'disabled'
      },
      fr: {
        '🆙🔊 Texte et son': 'textAndSound',
        '🆙💬 Texte et TTS': 'ttsAndText',
        '💬 TTS seulement': 'ttsOnly',
        '🆙 Texte seulement': 'textOnly',
        '❌ Désactivé': 'disabled'
      },
      ja: {
        '🆙🔊 テキストと音声': 'textAndSound',
        '🆙💬 テキストとTTS': 'ttsAndText',
        '💬 TTSのみ': 'ttsOnly',
        '🆙 テキストのみ': 'textOnly',
        '❌ 無効': 'disabled'
      },
      cn: {
        '🆙🔊 文字显示与提示音': 'textAndSound',
        '🆙💬 文字显示与TTS': 'ttsAndText',
        '💬 只使用TTS': 'ttsOnly',
        '🆙 只使用文字显示': 'textOnly',
        '❌ 禁用': 'disabled'
      },
      ko: {
        '🆙🔊 텍스트와 소리': 'textAndSound',
        '🆙💬 텍스트와 TTS': 'ttsAndText',
        '💬 TTS만': 'ttsOnly',
        '🆙 텍스트만': 'textOnly',
        '❌ 비활성화': 'disabled'
      }
    },
    default: 'textAndSound',
    setterFunc: setOptionsFromOutputValue
  }, {
    id: 'AlertsLanguage',
    name: {
      en: 'Alerts language',
      de: 'Alert Sprache',
      fr: 'Langue des alertes',
      ja: '警告情報の言語',
      cn: '警报提示文字的语言',
      ko: '알람 언어'
    },
    type: 'select',
    options: {
      en: {
        'Use Display Language': 'default',
        'English (en)': 'en',
        'Chinese (cn)': 'cn',
        'German (de)': 'de',
        'French (fr)': 'fr',
        'Japanese (ja)': 'ja',
        'Korean (ko)': 'ko'
      },
      fr: {
        'Utiliser la langue d\'affichage': 'default',
        'Anglais (en)': 'en',
        'Chinois (cn)': 'cn',
        'Allemand (de)': 'de',
        'Français (fr)': 'fr',
        'Japonais (ja)': 'ja',
        'Coréen (ko)': 'ko'
      },
      ja: {
        '表示言語既定値': 'default',
        '英語 (en)': 'en',
        '中国語 (cn)': 'cn',
        'ドイツ語 (de)': 'de',
        'フランス語 (fr)': 'fr',
        '日本語 (ja)': 'ja',
        '韓国語 (ko)': 'ko'
      },
      cn: {
        '使用显示语言': 'default',
        '英语 (en)': 'en',
        '汉语 (cn)': 'cn',
        '德语 (de)': 'de',
        '法语 (fr)': 'fr',
        '日语 (ja)': 'ja',
        '韩语 (ko)': 'ko'
      },
      ko: {
        '주 사용 언어 사용': 'default',
        '영어 (en)': 'en',
        '중국어 (cn)': 'cn',
        '독일어 (de)': 'de',
        '프랑스어 (fr)': 'fr',
        '일본어 (ja)': 'ja',
        '한국어 (ko)': 'ko'
      }
    },
    default: 'default',
    debug: true,
    setterFunc: (options, value) => {
      if (value === 'default') return;
      options['AlertsLanguage'] = value;
    }
  }, {
    id: 'TimelineLanguage',
    name: {
      en: 'Timeline language',
      de: 'Timeline Sprache',
      fr: 'Langue de la timeline',
      ja: 'タイムラインの言語',
      cn: '时间轴文本的语言',
      ko: '타임라인 언어'
    },
    type: 'select',
    options: {
      en: {
        'Use FFXIV Plugin Language': 'default',
        'English (en)': 'en',
        'Chinese (cn)': 'cn',
        'German (de)': 'de',
        'French (fr)': 'fr',
        'Japanese (ja)': 'ja',
        'Korean (ko)': 'ko'
      },
      de: {
        'Benutze FFXIV Plugin Sprache': 'default',
        'Englisch (en)': 'en',
        'Chinesisch (cn)': 'cn',
        'Deutsch (de)': 'de',
        'Französisch (fr)': 'fr',
        'Japanisch (ja)': 'ja',
        'Koreanisch (ko)': 'ko'
      },
      fr: {
        'Utiliser la langue du Plugin FFXIV': 'default',
        'Anglais (en)': 'en',
        'Chinois (cn)': 'cn',
        'Allemand (de)': 'de',
        'Français (fr)': 'fr',
        'Japonais (ja)': 'ja',
        'Coréen (ko)': 'ko'
      },
      ja: {
        'FFXIV Pluginの言語設定': 'default',
        '英語 (en)': 'en',
        '中国語 (cn)': 'cn',
        'ドイツ語 (de)': 'de',
        'フランス語 (fr)': 'fr',
        '日本語 (ja)': 'ja',
        '韓国語 (ko)': 'ko'
      },
      cn: {
        '使用最终幻想XIV解析插件设置的语言': 'default',
        '英语 (en)': 'en',
        '汉语 (cn)': 'cn',
        '德语 (de)': 'de',
        '法语 (fr)': 'fr',
        '日语 (ja)': 'ja',
        '韩语 (ko)': 'ko'
      },
      ko: {
        'FFXIV Plugin 언어 사용': 'default',
        '영어 (en)': 'en',
        '중국어 (cn)': 'cn',
        '독일어 (de)': 'de',
        '프랑스어 (fr)': 'fr',
        '일본어 (ja)': 'ja',
        '한국어 (ko)': 'ko'
      }
    },
    default: 'default',
    debug: true,
    setterFunc: (options, value) => {
      if (value === 'default') return;
      options['TimelineLanguage'] = value;
    }
  }, {
    id: 'Skin',
    name: {
      en: 'Raidboss Skin',
      de: 'Raidboss Skin',
      fr: 'Raidboss Skin',
      ja: 'Raidbossのスキン',
      cn: 'Raidboss皮肤',
      ko: 'Raidboss 스킨'
    },
    type: 'select',
    options: {
      en: {
        'Default': 'default',
        'lippe': 'lippe'
      },
      de: {
        'Default': 'default',
        'lippe': 'lippe'
      },
      fr: {
        'Défaut': 'default',
        'lippe': 'lippe'
      },
      ja: {
        '初期設定': 'default',
        'lippe': 'lippe'
      },
      cn: {
        '默认': 'default',
        'lippe': 'lippe'
      },
      ko: {
        '기본': 'default',
        'lippe': 'lippe'
      }
    },
    default: 'default'
  }, {
    id: 'TimelineEnabled',
    name: {
      en: 'Timeline enabled',
      de: 'Timeline aktiviert',
      fr: 'Timeline activée',
      ja: 'タイムラインを有効にする',
      cn: '启用时间轴',
      ko: '타임라인 활성화'
    },
    type: 'checkbox',
    default: true
  }, {
    id: 'AlertsEnabled',
    name: {
      en: 'Alerts enabled',
      de: 'Alerts aktiviert',
      fr: 'Alertes activées',
      ja: '警告情報を有効にする',
      cn: '启用提示文本显示',
      ko: '알람 활성화'
    },
    type: 'checkbox',
    default: true
  }, {
    id: 'ShowTimerBarsAtSeconds',
    name: {
      en: 'Timer bar show window (seconds)',
      de: 'Timer-Bar Anzeigedauer (in Sekunden)',
      fr: 'Fenêtre d\'affichage de la barre de temps (secondes)',
      ja: 'タイムバーに時間表示 (秒)',
      cn: '计时条显示时长 (秒)',
      ko: '타임라인을 표시할 기준 시간 (초 이하)'
    },
    type: 'float',
    default: 30
  }, {
    id: 'KeepExpiredTimerBarsForSeconds',
    name: {
      en: 'Keep expired timer bar (seconds)',
      de: 'Behalte abgelaufene Timer-Bar (in Sekunden)',
      fr: 'Garder la barre de temps expirée (secondes)',
      ja: '終了したタイムバーが消えるまでの待ち時間 (秒)',
      cn: '已失效的计时条的淡出时间 (秒)',
      ko: '만료된 타임라인이 사라지기까지의 시간 (초)'
    },
    type: 'float',
    default: 0.7
  }, {
    id: 'BarExpiresSoonSeconds',
    name: {
      en: 'Time to recolor timer as expiring soon (seconds)',
      de: 'Zeit bis ein bald auslaufender Timer umgefärbt wird (in Sekunden)',
      fr: 'Recolorisation de la barre de temps avant expiration (secondes)',
      ja: 'タイムバーが終了前に再度色付けの残り時間 (秒)',
      cn: '倒计时小于该值时当前计时条变色 (秒)',
      ko: '타임라인의 색상을 바꿀 기준 시간 (초 이하)'
    },
    type: 'integer',
    default: 6
  }, {
    id: 'MaxNumberOfTimerBars',
    name: {
      en: 'Max number of timer bars',
      de: 'Max Anzahl an Timer-Bars',
      fr: 'Nombre max de barres de temps',
      ja: 'タイムバーの最大数',
      cn: '计时条最大数量',
      ko: '표시할 타임라인의 최대 개수'
    },
    type: 'integer',
    default: 6
  }, {
    id: 'DisplayAlarmTextForSeconds',
    name: {
      en: 'Alarm text display duration (seconds)',
      de: 'Alarm-Text Anzeigedauer (in Sekunden)',
      fr: 'Durée d\'affichage du texte d\'alarme (secondes)',
      ja: '警報テキスト表示時間の長さ (秒)',
      cn: '警报文字显示持续时间 (秒)',
      ko: '경고 텍스트를 표시할 시간 (초)'
    },
    type: 'float',
    default: 3
  }, {
    id: 'DisplayAlertTextForSeconds',
    name: {
      en: 'Alert text display duration (seconds)',
      de: 'Alert-Text Anzeigedauer (in Sekunden)',
      fr: 'Durée d\'affichage du texte d\'alerte (secondes)',
      ja: '警告テキスト表示時間の長さ (秒)',
      cn: '警告文字显示持续时间 (秒)',
      ko: '주의 텍스트를 표시할 시간 (초)'
    },
    type: 'float',
    default: 3
  }, {
    id: 'DisplayInfoTextForSeconds',
    name: {
      en: 'Info text display duration (seconds)',
      de: 'Info-Text Anzeigedauer (in Sekunden)',
      fr: 'Durée d\'affichage du texte d\'information (secondes)',
      ja: '情報テキスト表示時間の長さ (秒)',
      cn: '信息文字显示持续时间 (秒)',
      ko: '안내 텍스트를 표시할 시간 (초)'
    },
    type: 'float',
    default: 3
  }, {
    id: 'AlarmSoundVolume',
    name: {
      en: 'Alarm sound volume (0-1)',
      de: 'Alarm Lautstärke (0-1)',
      fr: 'Volume de l\'alarme (0-1)',
      ja: '警報音声の音量 (0-1)',
      cn: '警报提示音的音量 (0-1)',
      ko: '경고 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'AlertSoundVolume',
    name: {
      en: 'Alert sound volume (0-1)',
      de: 'Alert Lautstärke (0-1)',
      fr: 'Volume de l\'alerte (0-1)',
      ja: '警告音声の音量 (0-1)',
      cn: '警告提示音的音量 (0-1)',
      ko: '주의 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'InfoSoundVolume',
    name: {
      en: 'Info sound volume (0-1)',
      de: 'Info Lautstärke (0-1)',
      fr: 'Volume de l\'info (0-1)',
      ja: '情報音声の音量 (0-1)',
      cn: '信息提示音的音量 (0-1)',
      ko: '안내 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'LongSoundVolume',
    name: {
      en: 'Long sound volume (0-1)',
      de: 'Langer Ton Lautstärke (0-1)',
      fr: 'Volume du son long (0-1)',
      ja: '長い音声の音量 (0-1)',
      cn: '长提示音的音量 (0-1)',
      ko: '긴 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'PullSoundVolume',
    name: {
      en: 'Pull sound volume (0-1)',
      de: 'Pull Lautstärke (0-1)',
      fr: 'Volume du son de pull (0-1)',
      ja: 'タゲ取る効果音の音量 (0-1)',
      cn: '开怪提示音的音量 (0-1)',
      ko: '풀링 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'cactbotWormholeStrat',
    // TODO: maybe need some way to group these kinds of
    // options if we end up having a lot?
    name: {
      en: 'Alex Ultimate: enable cactbot Wormhole strat',
      de: 'Alex Ultimate: aktiviere cactbot Wormhole Strategie',
      fr: 'Alex fatal : activer cactbot pour Wormhole strat',
      ja: '絶アレキサンダー討滅戦：cactbot「次元断絶のマーチ」ギミック',
      cn: '亚历山大绝境战：cactbot灵泉辅助功能',
      ko: '절 알렉: cactbot 웜홀 공략방식 활성화'
    },
    type: 'checkbox',
    default: false
  }, {
    id: 'cactbote8sUptimeKnockbackStrat',
    name: {
      en: 'e8s: enable cactbot Uptime Knockback strat',
      de: 'e8s: aktiviere cactbot Uptime Knockback Strategie',
      fr: 'e8s : activer cactbot pour Uptime Knockback strat',
      ja: 'エデン零式共鳴編４層：cactbot「ヘヴンリーストライク (ノックバック)」ギミック',
      cn: 'E8S: 启用cactbot的击退提示功能',
      ko: '공명 영웅 4층: cactbot 정확한 타이밍 넉백방지 공략 활성화'
    },
    type: 'checkbox',
    default: false
  }]
};
user_config/* default.registerOptions */.Z.registerOptions('raidboss', templateOptions, userFileHandler);
;// CONCATENATED MODULE: ./ui/config/config.js




 // Load other config files









const config_Options = {};
let gConfig = null; // Text in the butter bar, to prompt the user to reload after a config change.

const kReloadText = {
  en: 'To apply configuration changes, reload cactbot overlays.',
  de: 'Um die Änderungen zu aktivieren, aktualisiere bitte die Cactbot Overlays.',
  fr: 'Afin d\'appliquer les modifications, il faut recharger l\'overlay Cactbot.',
  ja: '設定を有効にする為、Cactbotオーバーレイを再読み込みしてください',
  cn: '要应用配置更改，请重新加载cactbot悬浮窗。',
  ko: '변경사항을 적용하려면, 오버레이를 새로고침 하십시오.'
}; // Text in the butter bar reload button.

const kReloadButtonText = {
  en: 'Reload',
  de: 'Aktualisieren',
  fr: 'Recharger',
  ja: '再読み込み',
  cn: '重新加载',
  ko: '새로고침'
}; // Text on the directory choosing button.

const kDirectoryChooseButtonText = {
  en: 'Choose Directory',
  de: 'Wähle ein Verzeichnis',
  fr: 'Choix du répertoire',
  ja: 'ディレクトリを選択',
  cn: '选择目录',
  ko: '디렉토리 선택'
}; // What to show when a directory hasn't been chosen.

const kDirectoryDefaultText = {
  en: '(Default)',
  de: '(Standard)',
  fr: '(Défaut)',
  ja: '(初期設定)',
  cn: '(默认)',
  ko: '(기본)'
}; // Translating data folders to a category name.

const kPrefixToCategory = {
  '00-misc': {
    en: 'General Triggers',
    de: 'General Trigger',
    fr: 'Général Triggers',
    ja: '汎用',
    cn: '通用触发器',
    ko: '공용 트리거'
  },
  '02-arr': {
    en: 'A Realm Reborn (ARR 2.x)',
    de: 'A Realm Reborn (ARR 2.x)',
    fr: 'A Realm Reborn (ARR 2.x)',
    ja: '新生エオルゼア (2.x)',
    cn: '重生之境 (2.x)',
    ko: '신생 에오르제아 (2.x)'
  },
  '03-hw': {
    en: 'Heavensward (HW 3.x)',
    de: 'Heavensward (HW 3.x)',
    fr: 'Heavensward (HW 3.x)',
    ja: '蒼天のイシュガルド (3.x)',
    cn: '苍穹之禁城 (3.x)',
    ko: '창천의 이슈가르드 (3.x)'
  },
  '04-sb': {
    en: 'Stormblood (SB 4.x)',
    de: 'Stormblood (SB 4.x)',
    fr: 'Stormblood (SB 4.x)',
    ja: '紅蓮のリベレーター (4.x)',
    cn: '红莲之狂潮 (4.x)',
    ko: '홍련의 해방자 (4.x)'
  },
  '05-shb': {
    en: 'Shadowbringers (ShB 5.x)',
    de: 'Shadowbringers (ShB 5.x)',
    fr: 'Shadowbringers (ShB 5.x)',
    ja: '漆黒のヴィランズ (5.x)',
    cn: '暗影之逆焰 (5.x)',
    ko: '칠흑의 반역자 (5.x)'
  },
  'user': {
    en: 'User Triggers',
    de: 'Benutzer Trigger',
    fr: 'Triggers personnalisés',
    ja: 'ユーザートリガー',
    cn: '自定义触发器'
  }
}; // Translating data subfolders to encounter type.

const kDirectoryToCategory = {
  alliance: {
    en: 'Alliance Raid',
    de: 'Allianz-Raid',
    fr: 'Raid en Alliance',
    ja: 'アライアンスレイド',
    cn: '团队任务',
    ko: '연합 레이드'
  },
  dungeon: {
    en: 'Dungeon',
    de: 'Dungeon',
    fr: 'Donjon',
    ja: 'ダンジョン',
    cn: '迷宫挑战',
    ko: '던전'
  },
  eureka: {
    en: 'Eureka',
    de: 'Eureka',
    fr: 'Eurêka',
    ja: '禁断の地エウレカ',
    cn: '禁地优雷卡',
    ko: '에우레카'
  },
  raid: {
    en: 'Raid',
    de: 'Raid',
    fr: 'Raid',
    ja: 'レイド',
    cn: '大型任务',
    ko: '레이드'
  },
  pvp: {
    en: 'PVP',
    de: 'PvP',
    fr: 'JcJ',
    ja: 'PvP',
    cn: 'PvP',
    ko: 'PvP'
  },
  trial: {
    en: 'Trial',
    de: 'Prüfung',
    fr: 'Défi',
    ja: '討伐・討滅戦',
    cn: '讨伐歼灭战',
    ko: '토벌전'
  },
  ultimate: {
    en: 'Ultimate',
    de: 'Fatale Raids',
    fr: 'Raid fatal',
    ja: '絶シリーズ',
    cn: '绝境战',
    ko: '절 난이도'
  }
}; // TODO: maybe we should also sort all the filenames properly too?
// TODO: use ZoneId to get this

const fileNameToTitle = filename => {
  // Strip directory and extension.
  const file = filename.replace(/^.*\//, '').replace(/\.[jt]s/g, ''); // Remove non-name characters (probably).

  const name = file.replace(/[_-]/g, ' '); // Capitalize the first letter of every word.

  let capitalized = name.replace(/(?:^| )\w/g, c => c.toUpperCase()); // Fully capitalize acronyms like e4n.

  if (/^\w[0-9]+\w$/.test(capitalized)) capitalized = capitalized.toUpperCase();
  return capitalized;
};

class CactbotConfigurator {
  constructor(configOptions, savedConfig) {
    // Predefined, only for ordering purposes.
    this.contents = {
      // top level
      'general': [],
      // things most people care about
      'raidboss': [],
      'jobs': []
    };
    this.configOptions = configOptions; // If the user has set a display language, use that.
    // Otherwise, use the operating system language as a default for the config tool.

    this.lang = configOptions.DisplayLanguage || configOptions.ShortLocale;
    this.savedConfig = savedConfig || {};
    this.developerOptions = this.getOption('general', 'ShowDeveloperOptions', false);
    const templates = user_config/* default.optionTemplates */.Z.optionTemplates;

    for (const group in templates) {
      this.contents[group] = this.contents[group] || [];
      this.contents[group].push(templates[group]);
    }

    this.buildButterBar();
    const container = document.getElementById('container');
    this.buildUI(container, this.contents);
  }

  async saveConfigData() {
    // TODO: rate limit this?
    await (0,overlay_plugin_api/* callOverlayHandler */.ae)({
      call: 'cactbotSaveData',
      overlay: 'options',
      data: this.savedConfig
    });
    document.getElementById('butter-margin').classList.remove('hidden');
  } // Helper translate function.  Takes in an object with language keys
  // and returns a single entry based on available translations.


  translate(textObj) {
    if (textObj === null || typeof textObj !== 'object' || !textObj['en']) return textObj;
    const t = textObj[this.lang];
    if (t) return t;
    return textObj['en'];
  } // takes variable args, with the last value being the default value if
  // any key is missing.
  // e.g. (foo, bar, baz, 5) with {foo: { bar: { baz: 3 } } } will return
  // the value 3.  Requires at least two args.


  getOption() {
    const num = arguments.length;

    if (num < 2) {
      console.error('getOption requires at least two args');
      return;
    }

    const defaultValue = arguments[num - 1];
    let objOrValue = this.savedConfig;

    for (let i = 0; i < num - 1; ++i) {
      objOrValue = objOrValue[arguments[i]];
      if (typeof objOrValue === 'undefined') return defaultValue;
    }

    return objOrValue;
  } // takes variable args, with the last value being the 'value' to set it to
  // e.g. (foo, bar, baz, 3) will set {foo: { bar: { baz: 3 } } }.
  // requires at least two args.


  setOption() {
    const num = arguments.length;

    if (num < 2) {
      console.error('setOption requires at least two args');
      return;
    } // Set keys and create default {} if it doesn't exist.


    let obj = this.savedConfig;

    for (let i = 0; i < num - 2; ++i) {
      const arg = arguments[i];
      obj[arg] = obj[arg] || {};
      obj = obj[arg];
    } // Set the last key to have the final argument's value.


    obj[arguments[num - 2]] = arguments[num - 1];
    this.saveConfigData();
  }

  buildButterBar() {
    const container = document.getElementById('butter-bar');
    const textDiv = document.createElement('div');
    textDiv.classList.add('reload-text');
    textDiv.innerText = this.translate(kReloadText);
    container.appendChild(textDiv);
    const buttonInput = document.createElement('input');
    buttonInput.classList.add('reload-button');
    buttonInput.type = 'button';

    buttonInput.onclick = () => {
      (0,overlay_plugin_api/* callOverlayHandler */.ae)({
        call: 'cactbotReloadOverlays'
      });
    };

    buttonInput.value = this.translate(kReloadButtonText);
    container.appendChild(buttonInput);
  } // Top level UI builder, builds everything.


  buildUI(container, contents) {
    for (const group in contents) {
      const content = contents[group];
      if (content.length === 0) continue; // For each overlay options template, build a section for it.
      // Then iterate through all of its options and build ui for those options.
      // Give each options template a chance to build special ui.

      const groupDiv = this.buildOverlayGroup(container, group);

      for (let i = 0; i < content.length; ++i) {
        const options = content[i].options || [];

        for (let j = 0; j < options.length; ++j) {
          const opt = options[j];
          if (!this.developerOptions && opt.debugOnly) continue;
          const buildFunc = {
            checkbox: this.buildCheckbox,
            select: this.buildSelect,
            float: this.buildFloat,
            integer: this.buildInteger,
            directory: this.buildDirectory
          }[opt.type];

          if (!buildFunc) {
            console.error('unknown type: ' + JSON.stringify(opt));
            continue;
          }

          buildFunc.bind(this)(groupDiv, opt, group);
        }

        const builder = content[i].buildExtraUI;
        if (builder) builder(this, groupDiv);
      }
    }
  } // Overlay builder for each overlay type (e.g. raidboss, jobs).


  buildOverlayGroup(container, group) {
    const collapser = document.createElement('div');
    collapser.classList.add('overlay-container');
    container.appendChild(collapser);
    const a = document.createElement('a');
    a.name = group;
    collapser.appendChild(a);
    const header = document.createElement('div');
    header.classList.add('overlay-header');
    header.innerText = group;
    a.appendChild(header);
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('overlay-options');
    collapser.appendChild(groupDiv);

    a.onclick = e => {
      a.parentNode.classList.toggle('collapsed');
    };

    return groupDiv;
  }

  buildNameDiv(opt) {
    const div = document.createElement('div');
    div.innerHTML = this.translate(opt.name);
    div.classList.add('option-name');
    return div;
  }

  buildCheckbox(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');
    const input = document.createElement('input');
    div.appendChild(input);
    input.type = 'checkbox';
    input.checked = this.getOption(group, opt.id, opt.default);

    input.onchange = () => this.setOption(group, opt.id, input.checked);

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  }

  buildDirectory(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');
    div.classList.add('input-dir-container');
    const input = document.createElement('input');
    input.type = 'submit';
    input.value = this.translate(kDirectoryChooseButtonText);
    input.classList.add('input-dir-submit');
    div.appendChild(input);
    const label = document.createElement('div');
    label.classList.add('input-dir-label');
    div.appendChild(label);

    const setLabel = str => {
      if (str) label.innerText = str;else label.innerText = this.translate(kDirectoryDefaultText);
    };

    setLabel(this.getOption(group, opt.id, opt.default));
    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);

    input.onclick = async () => {
      // Prevent repeated clicks on the folder chooser.
      // callOverlayHandler is not synchronous.
      // FIXME: do we need some clearer UI here (like pretending to be modal?)
      input.disabled = true;
      const prevValue = label.innerText;
      label.innerText = '';
      const result = await (0,overlay_plugin_api/* callOverlayHandler */.ae)({
        call: 'cactbotChooseDirectory'
      });
      input.disabled = false;
      const dir = result.data ? result.data : '';
      if (dir !== prevValue) this.setOption(group, opt.id, dir);
      setLabel(dir);
    };
  }

  buildSelect(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');
    const input = document.createElement('select');
    div.appendChild(input);
    const defaultValue = this.getOption(group, opt.id, opt.default);

    input.onchange = () => this.setOption(group, opt.id, input.value);

    const innerOptions = this.translate(opt.options);

    for (const key in innerOptions) {
      const elem = document.createElement('option');
      elem.value = innerOptions[key];
      elem.innerHTML = key;
      if (innerOptions[key] === defaultValue) elem.selected = true;
      input.appendChild(elem);
    }

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  } // FIXME: this could use some data validation if a user inputs non-floats.


  buildFloat(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');
    const input = document.createElement('input');
    div.appendChild(input);
    input.type = 'text';
    input.step = 'any';
    input.value = this.getOption(group, opt.id, parseFloat(opt.default));

    const setFunc = () => this.setOption(group, opt.id, input.value);

    input.onchange = setFunc;
    input.oninput = setFunc;
    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  } // FIXME: this could use some data validation if a user inputs non-integers.


  buildInteger(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');
    const input = document.createElement('input');
    div.appendChild(input);
    input.type = 'text';
    input.step = 1;
    input.value = this.getOption(group, opt.id, parseInt(opt.default));

    const setFunc = () => this.setOption(group, opt.id, input.value);

    input.onchange = setFunc;
    input.oninput = setFunc;
    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  }

  processFiles(files, userTriggerSets) {
    const map = {};

    for (const filename in files) {
      if (!filename.endsWith('.js') && !filename.endsWith('.ts')) continue;
      let prefixKey = '00-misc';

      for (const str in kPrefixToCategory) {
        if (!filename.startsWith(str)) continue;
        prefixKey = str;
        break;
      }

      let typeKey = 'general';

      for (const str in kDirectoryToCategory) {
        if (!filename.includes('/' + str + '/')) continue;
        typeKey = str;
        break;
      }

      const triggerSet = files[filename];
      let title = fileNameToTitle(filename);
      let zoneId = undefined; // Make assumptions about trigger structure here to try to get the zoneId out.

      if (triggerSet && 'zoneId' in triggerSet) {
        zoneId = triggerSet.zoneId; // Use the translatable zone info name, if possible.

        const zoneInfo = zone_info/* default */.Z[zoneId];
        if (zoneInfo) title = this.translate(zoneInfo.name);
      }

      const fileKey = filename.replace(/\//g, '-').replace(/.[jt]s$/, '');
      map[fileKey] = {
        filename: filename,
        fileKey: fileKey,
        prefixKey: prefixKey,
        prefix: this.translate(kPrefixToCategory[prefixKey]),
        section: this.translate(kPrefixToCategory[prefixKey]),
        type: this.translate(kDirectoryToCategory[typeKey]),
        title: title,
        triggerSet: triggerSet,
        zoneId: zoneId
      };
    }

    const userMap = {};
    let userFileIdx = 0;

    for (const triggerSet of userTriggerSets || []) {
      if (!triggerSet) continue;
      const fileKey = `user/${triggerSet.filename}/${userFileIdx++}`; // cactbot triggers all use zoneId, but user triggers in the wild
      // may also use zoneRegex or also have errors and not have either.

      let title = '???';
      let zoneId = 'undefined';

      if ('zoneId' in triggerSet) {
        zoneId = triggerSet.zoneId; // Use the translatable zone info name, if possible.

        const zoneInfo = zone_info/* default */.Z[zoneId];
        if (zoneInfo) title = this.translate(zoneInfo.name);
      } else if ('zoneRegex' in triggerSet) {
        // zoneRegex can be a localized object.
        let zoneRegex = this.translate(triggerSet.zoneRegex);
        if (typeof zoneRegex === 'string') zoneRegex = regexes/* default.parse */.Z.parse(zoneRegex);
        if (zoneRegex instanceof RegExp) title = `/${zoneRegex.source}/`;
      }

      userMap[fileKey] = {
        filename: triggerSet.filename,
        fileKey: fileKey,
        prefixKey: 'user',
        prefix: this.translate(kPrefixToCategory['user']),
        section: triggerSet.filename,
        title: title,
        type: null,
        triggerSet: triggerSet,
        zoneId: zoneId
      };
    }

    const sortedEntries = Object.keys(map).sort((keyA, keyB) => {
      // Sort first by expansion.
      const entryA = map[keyA];
      const entryB = map[keyB];
      const prefixCompare = entryA.prefixKey.localeCompare(entryB.prefixKey);
      if (prefixCompare !== 0) return prefixCompare; // Then sort by contentList.

      const indexA = content_list.indexOf(entryA.zoneId);
      const indexB = content_list.indexOf(entryB.zoneId);

      if (indexA === -1 && indexB === -1) {
        // If we don't know, sort by strings.
        return keyA.localeCompare(keyB);
      } else if (indexA === -1) {
        // Sort B first.
        return 1;
      } else if (indexB === -1) {
        // Sort A first.
        return -1;
      } // Default: sort by index in contentList.


      return indexA - indexB;
    }); // Rebuild map with keys in the right order.

    const sortedMap = {};

    for (const key of sortedEntries) sortedMap[key] = map[key]; // Tack on user triggers at the end in the order they were eval'd.


    for (const key in userMap) sortedMap[key] = userMap[key];

    return sortedMap;
  }

}
user_config/* default.getUserConfigLocation */.Z.getUserConfigLocation('config', config_Options, async e => {
  gConfig = new CactbotConfigurator(config_Options, user_config/* default.savedConfig */.Z.savedConfig);
});

/***/ }),

/***/ 152:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// For consistency with Responses, Conditions
// are also functions.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    targetIsYou() {
        return (data, matches) => data.me === (matches === null || matches === void 0 ? void 0 : matches.target);
    },
    targetIsNotYou() {
        return (data, matches) => data.me !== (matches === null || matches === void 0 ? void 0 : matches.target);
    },
    caresAboutAOE() {
        return (data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
    },
    caresAboutMagical() {
        return (data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
    },
    caresAboutPhysical() {
        return (data) => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
    },
});


/***/ }),

/***/ 5:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Auto-generated from gen_zone_id_and_info.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    'BeastTribeQuests': 13,
    'Companions': 12,
    'CustomDeliveries': 25,
    'DeepDungeons': 21,
    'DisciplesOfTheHand': 17,
    'DisciplesOfTheLand': 16,
    'Dungeons': 2,
    'DutyRoulette': 1,
    'Eureka': 26,
    'Fates': 8,
    'GoldSaucer': 19,
    'GrandCompany': 11,
    'Guildhests': 3,
    'Levequests': 10,
    'OverallCompletion': 14,
    'PlayerCommendation': 15,
    'Pvp': 6,
    'QuestBattles': 7,
    'Raids': 5,
    'RetainerVentures': 18,
    'TreasureHunt': 9,
    'Trials': 4,
    'UltimateRaids': 28,
    'WondrousTails': 24,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data);


/***/ }),

/***/ 381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ NetRegexes)
/* harmony export */ });
/* harmony import */ var _regexes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(201);

// Differences from Regexes:
// * may have more fields
// * AddedCombatant npc id is broken up into npcNameId and npcBaseId
// * gameLog always splits name into its own field (but previously wouldn't)
const separator = '\\|';
const matchDefault = '[^|]*';
const startsUsingParams = (/* unused pure expression or super */ null && (['timestamp', 'sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'castTime']));
const abilityParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target']));
const abilityFullParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'flags', 'damage', 'targetCurrentHp', 'targetMaxHp', 'x', 'y', 'z', 'heading']));
const headMarkerParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'id']));
const addedCombatantParams = (/* unused pure expression or super */ null && (['id', 'name']));
const addedCombatantFullParams = (/* unused pure expression or super */ null && (['id', 'name', 'job', 'level', 'ownerId', 'world', 'npcNameId', 'npcBaseId', 'currentHp', 'hp', 'x', 'y', 'z', 'heading']));
const removingCombatantParams = (/* unused pure expression or super */ null && (['id', 'name', 'hp']));
const gainsEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'duration', 'sourceId', 'source', 'targetId', 'target', 'count']));
const statusEffectExplicitParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'hp', 'maxHp', 'x', 'y', 'z', 'heading', 'data0', 'data1', 'data2', 'data3', 'data4']));
const losesEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'sourceId', 'source', 'targetId', 'target', 'count']));
const tetherParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'targetId', 'target', 'id']));
const wasDefeatedParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'sourceId', 'source']));
const echoParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const dialogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const messageParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const gameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const gameNameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const statChangeParams = (/* unused pure expression or super */ null && (['job', 'strength', 'dexterity', 'vitality', 'intelligence', 'mind', 'piety', 'attackPower', 'directHit', 'criticalHit', 'attackMagicPotency', 'healMagicPotency', 'determination', 'skillSpeed', 'spellSpeed', 'tenacity']));
const changeZoneParams = (/* unused pure expression or super */ null && (['id', 'name']));
const network6dParams = (/* unused pure expression or super */ null && (['instance', 'command', 'data0', 'data1', 'data2', 'data3']));
const nameToggleParams = (/* unused pure expression or super */ null && (['id', 'name', 'toggle']));
// If NetRegexes.setFlagTranslationsNeeded is set to true, then any
// regex created that requires a translation will begin with this string
// and match the magicStringRegex.  This is maybe a bit goofy, but is
// a pretty straightforward way to mark regexes for translations.
// If issue #1306 is ever resolved, we can remove this.
const magicTranslationString = `^^`;
const magicStringRegex = /^\^\^/;
const keysThatRequireTranslation = [
    'ability',
    'name',
    'source',
    'target',
    'line',
];
const parseHelper = (params, funcName, fields) => {
    var _a, _b, _c, _d, _e, _f;
    params = params !== null && params !== void 0 ? params : {};
    const validFields = [];
    for (const value of Object.values(fields)) {
        if (typeof value !== 'object')
            continue;
        validFields.push(value.field);
    }
    _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, funcName, ['capture', ...validFields]);
    // Find the last key we care about, so we can shorten the regex if needed.
    const capture = _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.trueIfUndefined */ .Z.trueIfUndefined(params.capture);
    const fieldKeys = Object.keys(fields);
    let maxKey;
    if (capture) {
        maxKey = fieldKeys[fieldKeys.length - 1];
    }
    else {
        maxKey = 0;
        for (const key of fieldKeys) {
            const value = (_a = fields[key]) !== null && _a !== void 0 ? _a : {};
            if (typeof value !== 'object')
                continue;
            const fieldName = (_b = fields[key]) === null || _b === void 0 ? void 0 : _b.field;
            if (fieldName && fieldName in params)
                maxKey = key;
        }
    }
    // For testing, it's useful to know if this is a regex that requires
    // translation.  We test this by seeing if there are any specified
    // fields, and if so, inserting a magic string that we can detect.
    // This lets us differentiate between "regex that should be translated"
    // e.g. a regex with `target` specified, and "regex that shouldn't"
    // e.g. a gains effect with just effectId specified.
    const transParams = Object.keys(params).filter((k) => keysThatRequireTranslation.includes(k));
    const needsTranslations = NetRegexes.flagTranslationsNeeded && transParams.length > 0;
    // Build the regex from the fields.
    let str = needsTranslations ? magicTranslationString : '^';
    let lastKey = -1;
    for (const _key in fields) {
        const key = parseInt(_key);
        // Fill in blanks.
        const missingFields = key - lastKey - 1;
        if (missingFields === 1)
            str += '\\y{NetField}';
        else if (missingFields > 1)
            str += `\\y{NetField}{${missingFields}}`;
        lastKey = key;
        const value = fields[key];
        if (typeof value !== 'object')
            throw new Error(`${funcName}: invalid value: ${JSON.stringify(value)}`);
        const fieldName = (_c = fields[key]) === null || _c === void 0 ? void 0 : _c.field;
        const fieldValue = (_f = (_e = (_d = fields[key]) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : matchDefault;
        if (fieldName) {
            str += _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.maybeCapture */ .Z.maybeCapture(
            // more accurate type instead of `as` cast
            // maybe this function needs a refactoring
            capture, fieldName, params[fieldName], fieldValue) +
                separator;
        }
        else {
            str += fieldValue + separator;
        }
        // Stop if we're not capturing and don't care about future fields.
        if (key >= (maxKey !== null && maxKey !== void 0 ? maxKey : 0))
            break;
    }
    return _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.parse */ .Z.parse(str);
};
class NetRegexes {
    static setFlagTranslationsNeeded(value) {
        NetRegexes.flagTranslationsNeeded = value;
    }
    static doesNetRegexNeedTranslation(regex) {
        // Need to `setFlagTranslationsNeeded` before calling this function.
        console.assert(NetRegexes.flagTranslationsNeeded);
        const str = typeof regex === 'string' ? regex : regex.source;
        return !!magicStringRegex.exec(str);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
     */
    static startsUsing(params) {
        return parseHelper(params, 'startsUsing', {
            0: { field: 'type', value: '20' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'id' },
            5: { field: 'ability' },
            6: { field: 'targetId' },
            7: { field: 'target' },
            8: { field: 'castTime' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static ability(params) {
        return parseHelper(params, 'ability', {
            0: { field: 'type', value: '2[12]' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'id' },
            5: { field: 'ability' },
            6: { field: 'targetId' },
            7: { field: 'target' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static abilityFull(params) {
        return parseHelper(params, 'abilityFull', {
            0: { field: 'type', value: '2[12]' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'id' },
            5: { field: 'ability' },
            6: { field: 'targetId' },
            7: { field: 'target' },
            8: { field: 'flags' },
            9: { field: 'damage' },
            24: { field: 'targetCurrentHp' },
            25: { field: 'targetMaxHp' },
            40: { field: 'x' },
            41: { field: 'y' },
            42: { field: 'z' },
            43: { field: 'heading' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
     */
    static headMarker(params) {
        return parseHelper(params, 'headMarker', {
            0: { field: 'type', value: '27' },
            1: { field: 'timestamp' },
            2: { field: 'targetId' },
            3: { field: 'target' },
            6: { field: 'id' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatant(params) {
        return parseHelper(params, 'addedCombatant', {
            0: { field: 'type', value: '03' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatantFull(params) {
        return parseHelper(params, 'addedCombatantFull', {
            0: { field: 'type', value: '03' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
            4: { field: 'job' },
            5: { field: 'level' },
            6: { field: 'ownerId' },
            8: { field: 'world' },
            9: { field: 'npcNameId' },
            10: { field: 'npcBaseId' },
            11: { field: 'currentHp' },
            12: { field: 'hp' },
            17: { field: 'x' },
            18: { field: 'y' },
            19: { field: 'z' },
            20: { field: 'heading' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
     */
    static removingCombatant(params) {
        return parseHelper(params, 'removingCombatant', {
            0: { field: 'type', value: '04' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
            12: { field: 'hp' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
     */
    static gainsEffect(params) {
        return parseHelper(params, 'gainsEffect', {
            0: { field: 'type', value: '26' },
            1: { field: 'timestamp' },
            2: { field: 'effectId' },
            3: { field: 'effect' },
            4: { field: 'duration' },
            5: { field: 'sourceId' },
            6: { field: 'source' },
            7: { field: 'targetId' },
            8: { field: 'target' },
            9: { field: 'count' },
        });
    }
    /**
     * Prefer gainsEffect over this function unless you really need extra data.
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
     */
    static statusEffectExplicit(params) {
        return parseHelper(params, 'statusEffectExplicit', {
            0: { field: 'type', value: '38' },
            1: { field: 'timestamp' },
            2: { field: 'targetId' },
            3: { field: 'target' },
            5: { field: 'hp' },
            6: { field: 'maxHp' },
            11: { field: 'x' },
            12: { field: 'y' },
            13: { field: 'z' },
            14: { field: 'heading' },
            15: { field: 'data0' },
            16: { field: 'data1' },
            17: { field: 'data2' },
            18: { field: 'data3' },
            19: { field: 'data4' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
     */
    static losesEffect(params) {
        return parseHelper(params, 'losesEffect', {
            0: { field: 'type', value: '30' },
            1: { field: 'timestamp' },
            2: { field: 'effectId' },
            3: { field: 'effect' },
            5: { field: 'sourceId' },
            6: { field: 'source' },
            7: { field: 'targetId' },
            8: { field: 'target' },
            9: { field: 'count' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
     */
    static tether(params) {
        return parseHelper(params, 'tether', {
            0: { field: 'type', value: '35' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'targetId' },
            5: { field: 'target' },
            8: { field: 'id' },
        });
    }
    /**
     * 'target' was defeated by 'source'
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
     */
    static wasDefeated(params) {
        return parseHelper(params, 'wasDefeated', {
            0: { field: 'type', value: '25' },
            1: { field: 'timestamp' },
            2: { field: 'targetId' },
            3: { field: 'target' },
            4: { field: 'sourceId' },
            5: { field: 'source' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static echo(params) {
        if (typeof params === 'undefined')
            params = {};
        _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, 'echo', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0038';
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static dialog(params) {
        if (typeof params === 'undefined')
            params = {};
        _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, 'dialog', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0044';
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static message(params) {
        if (typeof params === 'undefined')
            params = {};
        _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, 'message', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0839';
        return NetRegexes.gameLog(params);
    }
    /**
     * fields: code, name, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameLog(params) {
        return parseHelper(params, 'gameLog', {
            0: { field: 'type', value: '00' },
            1: { field: 'timestamp' },
            2: { field: 'code' },
            3: { field: 'name' },
            4: { field: 'line' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameNameLog(params) {
        // for compat with Regexes.
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
     */
    static statChange(params) {
        return parseHelper(params, 'statChange', {
            0: { field: 'type', value: '12' },
            1: { field: 'timestamp' },
            2: { field: 'job' },
            3: { field: 'strength' },
            4: { field: 'dexterity' },
            5: { field: 'vitality' },
            6: { field: 'intelligence' },
            7: { field: 'mind' },
            8: { field: 'piety' },
            9: { field: 'attackPower' },
            10: { field: 'directHit' },
            11: { field: 'criticalHit' },
            12: { field: 'attackMagicPotency' },
            13: { field: 'healMagicPotency' },
            14: { field: 'determination' },
            15: { field: 'skillSpeed' },
            16: { field: 'spellSpeed' },
            18: { field: 'tenacity' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
     */
    static changeZone(params) {
        return parseHelper(params, 'changeZone', {
            0: { field: 'type', value: '01' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
     */
    static network6d(params) {
        return parseHelper(params, 'network6d', {
            0: { field: 'type', value: '33' },
            1: { field: 'timestamp' },
            2: { field: 'instance' },
            3: { field: 'command' },
            4: { field: 'data0' },
            5: { field: 'data1' },
            6: { field: 'data2' },
            7: { field: 'data3' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#22-networknametoggle
     */
    static nameToggle(params) {
        return parseHelper(params, 'nameToggle', {
            0: { field: 'type', value: '34' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
            6: { field: 'toggle' },
        });
    }
}
NetRegexes.flagTranslationsNeeded = false;


/***/ }),

/***/ 500:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": () => (/* binding */ UnreachableCode)
/* harmony export */ });
// Helper Error for TypeScript situations where the programmer thinks they
// know better than TypeScript that some situation will never occur.
// The intention here is that the programmer does not expect a particular
// bit of code to happen, and so has not written careful error handling.
// If it does occur, at least there will be an error and we can figure out why.
// This is preferable to casting or disabling TypeScript altogether in order to
// avoid syntax errors.
// One common example is a regex, where if the regex matches then all of the
// (non-optional) regex groups will also be valid, but TypeScript doesn't know.
class UnreachableCode extends Error {
    constructor() {
        super('This code shouldn\'t be reached');
    }
}


/***/ }),

/***/ 273:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Output strings for now require a field for every language, so this is a
// helper function to generate one for literal numbers.
const numberToOutputString = function (n) {
    const str = n.toString();
    return {
        en: str,
        de: str,
        fr: str,
        ja: str,
        cn: str,
        ko: str,
    };
};
// General guidelines:
// * property names should closely match English text
// * use OnPlayer suffix for things with `${player}`
// * use OnTarget suffix for things with `${name}`
// * any other parameters (of which there are none, currently) should use consistent suffixes.
// * the value of each property should be a single object with localized keys
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    aoe: {
        en: 'aoe',
        de: 'AoE',
        fr: 'AoE',
        ja: 'AoE',
        cn: 'AoE',
        ko: '전체 공격',
    },
    bigAoe: {
        en: 'big aoe!',
        de: 'Große AoE!',
        fr: 'Grosse AoE !',
        ja: '大ダメージAoE',
        cn: '大AoE伤害！',
        ko: '강한 전체 공격!',
    },
    tankBuster: {
        en: 'Tank Buster',
        de: 'Tank buster',
        fr: 'Tank buster',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
    },
    miniBuster: {
        en: 'Mini Buster',
        de: 'Kleiner Tankbuster',
        fr: 'Mini Buster',
        ja: 'ミニバスター',
        cn: '小死刑',
        ko: '약한 탱버',
    },
    tankBusterOnPlayer: {
        en: 'Tank Buster on ${player}',
        de: 'Tank buster auf ${player}',
        fr: 'Tank buster sur ${player}',
        ja: '${player}にタンクバスター',
        cn: '死刑 点 ${player}',
        ko: '"${player}" 탱버',
    },
    tankBusterOnYou: {
        en: 'Tank Buster on YOU',
        de: 'Tank buster auf DIR',
        fr: 'Tank buster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
        ko: '탱버 대상자',
    },
    // when there are multiple tankbusters going out
    tankBusters: {
        en: 'Tank Busters',
        de: 'Tank buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
    },
    tankCleave: {
        en: 'Tank cleave',
        de: 'Tank Cleave',
        fr: 'Tank cleave',
        ja: '前方範囲攻撃',
        cn: '顺劈',
        ko: '광역 탱버',
    },
    avoidTankCleave: {
        en: 'Avoid tank cleave',
        de: 'Tank Cleave ausweichen',
        fr: 'Évitez le tank cleave',
        ja: '前方範囲攻撃を避ける',
        cn: '远离顺劈',
        ko: '광역 탱버 피하기',
    },
    tankCleaveOnYou: {
        en: 'Tank cleave on YOU',
        de: 'Tank Cleave aud DIR',
        fr: 'Tank cleave sur VOUS',
        ja: '自分に前方範囲攻撃',
        cn: '顺劈点名',
        ko: '나에게 광역 탱버',
    },
    tankSwap: {
        en: 'Tank Swap!',
        de: 'Tankwechsel!',
        fr: 'Tank swap !',
        ja: 'タンクスイッチ!',
        cn: '换T！',
        ko: '탱 교대',
    },
    spread: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '分散',
        ko: '산개',
    },
    stackMarker: {
        // for stack marker situations
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Packez-vous',
        ja: '頭割り',
        cn: '分摊',
        ko: '쉐어뎀',
    },
    getTogether: {
        // for getting together without stack marker
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Packez-vous',
        ja: '集合',
        cn: '集合',
        ko: '쉐어뎀',
    },
    stackOnYou: {
        en: 'Stack on YOU',
        de: 'Auf DIR sammeln',
        fr: 'Package sur VOUS',
        ja: '自分に集合',
        cn: '集合点名',
        ko: '쉐어징 대상자',
    },
    stackOnPlayer: {
        en: 'Stack on ${player}',
        de: 'Auf ${player} sammeln',
        fr: 'Packez-vous sur ${player}',
        ja: '${player}に集合',
        cn: '靠近 ${player}集合',
        ko: '"${player}" 쉐어징',
    },
    stackMiddle: {
        en: 'Stack in middle',
        de: 'In der Mitte sammeln',
        fr: 'Packez-vous au milieu',
        ja: '中央で集合',
        cn: '中间集合',
        ko: '중앙에서 모이기',
    },
    doritoStack: {
        en: 'Dorito Stack',
        de: 'Mit Marker sammeln',
        fr: 'Packez les marquages',
        ja: 'マーカー付けた人と集合',
        cn: '点名集合',
        ko: '징끼리 모이기',
    },
    spreadThenStack: {
        en: 'Spread => Stack',
        de: 'Verteilen => Sammeln',
        fr: 'Dispersion => Package',
        ja: '散開 => 集合',
        cn: '分散 => 集合',
        ko: '산개 => 집합',
    },
    stackThenSpread: {
        en: 'Stack => Spread',
        de: 'Sammeln => Verteilen',
        fr: 'Package => Dispersion',
        ja: 'スタック => 散開',
        cn: '集合 => 分散',
        ko: '집합 => 산개',
    },
    knockback: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
        ko: '넉백',
    },
    knockbackOnYou: {
        en: 'Knockback on YOU',
        de: 'Rückstoß auf DIR',
        fr: 'Poussée sur VOUS',
        ja: '自分にノックバック',
        cn: '击退点名',
        ko: '넉백징 대상자',
    },
    knockbackOnPlayer: {
        en: 'Knockback on ${player}',
        de: 'Rückstoß auf ${player}',
        fr: 'Poussée sur ${player}',
        ja: '${player}にノックバック',
        cn: '击退点名${player}',
        ko: '"${player}" 넉백징',
    },
    lookTowardsBoss: {
        en: 'Look Towards Boss',
        de: 'Anschauen Boss',
        fr: 'Regardez le boss',
        ja: 'ボスを見る',
        cn: '面向Boss',
        ko: '쳐다보기',
    },
    lookAway: {
        en: 'Look Away',
        de: 'Wegschauen',
        fr: 'Regardez ailleurs',
        ja: 'ボスを見ない',
        cn: '背对Boss',
        ko: '뒤돌기',
    },
    lookAwayFromPlayer: {
        en: 'Look Away from ${player}',
        de: 'Schau weg von ${player}',
        fr: 'Ne regardez pas ${player}',
        ja: '${player}を見ない',
        cn: '背对${player}',
        ko: '${player}에게서 뒤돌기',
    },
    lookAwayFromTarget: {
        en: 'Look Away from ${name}',
        de: 'Schau weg von ${name}',
        fr: 'Ne regardez pas ${name}',
        ja: '${name}を見ない',
        cn: '背对${name}',
        ko: '${name}에게서 뒤돌기',
    },
    getBehind: {
        en: 'Get Behind',
        de: 'Hinter ihn',
        fr: 'Passez derrière',
        ja: '背面へ',
        cn: '去背后',
        ko: '보스 뒤로',
    },
    goFrontOrSides: {
        en: 'Go Front / Sides',
        de: 'Gehe nach Vorne/ zu den Seiten',
        fr: 'Allez Devant / Côtés',
        ja: '前／横へ',
        cn: '去前侧方',
        ko: '보스 후방 피하기',
    },
    goFront: {
        en: 'Go Front',
        de: 'Geh nach vorn',
        fr: 'Allez Devant',
        ja: '前へ',
        cn: '去前面',
        ko: '앞으로',
    },
    // getUnder is used when you have to get into the bosses hitbox
    getUnder: {
        en: 'Get Under',
        de: 'Unter ihn',
        fr: 'En dessous',
        ja: 'ボスに貼り付く',
        cn: '去脚下',
        ko: '보스 아래로',
    },
    // in is more like "get close but maybe even melee range is fine"
    in: {
        en: 'In',
        de: 'Rein',
        fr: 'Intérieur',
        ja: '中へ',
        cn: '靠近',
        ko: '안으로',
    },
    // out means get far away
    out: {
        en: 'Out',
        de: 'Raus',
        fr: 'Exterieur',
        ja: '外へ',
        cn: '远离',
        ko: '밖으로',
    },
    outOfMelee: {
        en: 'Out of melee',
        de: 'Raus aus Nahkampf',
        fr: 'Sortez de la mêlée',
        ja: '近接最大レンジ',
        cn: '近战最远距离回避',
        ko: '근접범위 밖으로',
    },
    inThenOut: {
        en: 'In, then out',
        de: 'Rein, dann raus',
        fr: 'Intérieur, puis extérieur',
        ja: '中 => 外',
        cn: '先靠近，再远离',
        ko: '안으로 => 밖으로',
    },
    outThenIn: {
        en: 'Out, then in',
        de: 'Raus, dann rein',
        fr: 'Extérieur, puis intérieur',
        ja: '外 => 中',
        cn: '先远离，再靠近',
        ko: '밖으로 => 안으로',
    },
    backThenFront: {
        en: 'Back Then Front',
        de: 'Nach Hinten, danach nach Vorne',
        fr: 'Derrière puis devant',
        ja: '後ろ => 前',
        cn: '后 => 前',
        ko: '뒤로 => 앞으로',
    },
    frontThenBack: {
        en: 'Front Then Back',
        de: 'Nach Vorne, danach nach Hinten',
        fr: 'Devant puis derrière',
        ja: '前 => 後ろ',
        cn: '前 => 后',
        ko: '앞으로 => 뒤로',
    },
    goIntoMiddle: {
        en: 'go into middle',
        de: 'in die Mitte gehen',
        fr: 'Allez au milieu',
        ja: '中へ',
        cn: '去中间',
        ko: '중앙으로',
    },
    right: {
        en: 'Right',
        de: 'Rechts',
        fr: 'À droite',
        ja: '右へ',
        cn: '右',
        ko: '오른쪽',
    },
    left: {
        en: 'Left',
        de: 'Links',
        fr: 'À gauche',
        ja: '左へ',
        cn: '左',
        ko: '왼쪽',
    },
    getLeftAndWest: {
        en: '<= Get Left/West',
        de: '<= Nach Links/Westen',
        fr: '<= Allez à Gauche/Ouest',
        ja: '<= 左/西へ',
        cn: '<= 去左/西边',
        ko: '<= 왼쪽으로',
    },
    getRightAndEast: {
        en: 'Get Right/East =>',
        de: 'Nach Rechts/Osten =>',
        fr: 'Allez à Droite/Est =>',
        ja: '右/東へ =>',
        cn: '去右/东边 =>',
        ko: '오른쪽으로 =>',
    },
    goFrontBack: {
        en: 'Go Front/Back',
        de: 'Geh nach Vorne/Hinten',
        fr: 'Allez Devant/Derrière',
        ja: '縦へ',
        cn: '去前后',
        ko: '앞/뒤로',
    },
    sides: {
        en: 'Sides',
        de: 'Seiten',
        fr: 'Côtés',
        ja: '横へ',
        cn: '去侧面',
        ko: '양옆으로',
    },
    middle: {
        en: 'Middle',
        de: 'Mitte',
        fr: 'Milieu',
        ja: '中へ',
        cn: '中间',
        ko: '중앙',
    },
    // killAdds is used for adds that will always be available
    killAdds: {
        en: 'Kill adds',
        de: 'Adds besiegen',
        fr: 'Tuez les adds',
        ja: '雑魚を処理',
        cn: '击杀小怪',
        ko: '쫄 잡기',
    },
    // killExtraAdd is used for adds that appear if a mechanic was not played correctly
    killExtraAdd: {
        en: 'Kill Extra Add',
        de: 'Add besiegen',
        fr: 'Tuez l\'add',
        ja: '雑魚を倒す',
        cn: '击杀小怪',
        ko: '쫄 잡기',
    },
    awayFromFront: {
        en: 'Away From Front',
        de: 'Weg von Vorne',
        fr: 'Éloignez-vous du devant',
        ja: '前方から離れる',
        cn: '远离正面',
        ko: '보스 전방 피하기',
    },
    sleepTarget: {
        en: 'Sleep ${name}',
        de: 'Schlaf auf ${name}',
        fr: 'Sommeil sur ${name}',
        ja: '${name} にスリプル',
        cn: '催眠 ${name}',
        ko: '${name} 슬리플',
    },
    stunTarget: {
        en: 'Stun ${name}',
        de: 'Betäubung auf ${name}',
        fr: 'Étourdissez ${name}',
        ja: '${name} にスタン',
        cn: '眩晕 ${name}',
        ko: '${name}기절',
    },
    interruptTarget: {
        en: 'interrupt ${name}',
        de: 'unterbreche ${name}',
        fr: 'Interrompez ${name}',
        ja: '${name} に沈黙',
        cn: '打断${name}',
        ko: '${name}기술 시전 끊기',
    },
    preyOnYou: {
        en: 'Prey on YOU',
        de: 'Marker auf DIR',
        fr: 'Marquage sur VOUS',
        ja: '自分に捕食',
        cn: '掠食点名',
        ko: '홍옥징 대상자',
    },
    preyOnPlayer: {
        en: 'Prey on ${player}',
        de: 'Marker auf ${player}',
        fr: 'Marquage sur ${player}',
        ja: '${player}に捕食',
        cn: '掠食点名${player}',
        ko: '"${player}" 홍옥징',
    },
    awayFromGroup: {
        en: 'Away from Group',
        de: 'Weg von der Gruppe',
        fr: 'Éloignez-vous du groupe',
        ja: '外へ',
        cn: '远离人群',
        ko: '다른 사람들이랑 떨어지기',
    },
    awayFromPlayer: {
        en: 'Away from ${player}',
        de: 'Weg von ${player}',
        fr: 'Éloignez-vous de ${player}',
        ja: '${player}から離れる',
        cn: '远离${player}',
        ko: '"${player}"에서 멀어지기',
    },
    meteorOnYou: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        fr: 'Météore sur VOUS',
        ja: '自分にメテオ',
        cn: '陨石点名',
        ko: '나에게 메테오징',
    },
    stopMoving: {
        en: 'Stop Moving!',
        de: 'Bewegung stoppen!',
        fr: 'Ne bougez pas !',
        ja: '移動禁止！',
        cn: '停止移动！',
        ko: '이동 멈추기!',
    },
    stopEverything: {
        en: 'Stop Everything!',
        de: 'Stoppe Alles!',
        fr: 'Arrêtez TOUT !',
        ja: '行動禁止！',
        cn: '停止行动！',
        ko: '행동 멈추기!',
    },
    moveAway: {
        // move away to dodge aoes
        en: 'Move!',
        de: 'Bewegen!',
        fr: 'Bougez !',
        ja: '避けて！',
        cn: '快躲开！',
        ko: '이동하기!',
    },
    moveAround: {
        // move around (e.g. jumping) to avoid being frozen
        en: 'Move!',
        de: 'Bewegen!',
        fr: 'Bougez !',
        ja: '動く！',
        cn: '快动！',
        ko: '움직이기!',
    },
    breakChains: {
        en: 'Break chains',
        de: 'Kette zerbrechen',
        fr: 'Brisez les chaines',
        ja: '線を切る',
        cn: '切断连线',
        ko: '선 끊기',
    },
    moveChainsTogether: {
        en: 'Move chains together',
        de: 'Ketten zusammen bewegen',
        fr: 'Bougez les chaines ensemble',
        ja: '線同士一緒に移動',
        cn: '连线一起移动',
        ko: '선 붙어서 같이 움직이기',
    },
    earthshakerOnYou: {
        en: 'Earth Shaker on YOU',
        de: 'Erdstoß auf DIR',
        fr: 'Marque de terre sur VOUS',
        ja: '自分にアースシェイカー',
        cn: '大地摇动点名',
        ko: '어스징 대상자',
    },
    wakeUp: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        ja: '目を覚まして！',
        cn: '醒醒！动一动！！',
        ko: '강제 퇴장 7분 전',
    },
    closeTethersWithPlayer: {
        en: 'Close Tethers (${player})',
        de: 'Nahe Verbindungen (${player})',
        fr: 'Liens proches avec (${player})',
        ja: '(${player})に近づく',
        cn: '靠近连线 (${player})',
        ko: '상대와 가까이 붙기 (${player})',
    },
    farTethersWithPlayer: {
        en: 'Far Tethers (${player})',
        de: 'Entfernte Verbindungen (${player})',
        fr: 'Liens éloignés avec (${player})',
        ja: ' (${player})から離れる',
        cn: '远离连线 (${player})',
        ko: '상대와 떨어지기 (${player})',
    },
    unknown: {
        en: '???',
        de: '???',
        fr: '???',
        ja: '???',
        cn: '???',
        ko: '???',
    },
    north: {
        en: 'North',
        de: 'Norden',
        fr: 'Nord',
        ja: '北',
        cn: '上(北)',
        ko: '북쪽',
    },
    south: {
        en: 'South',
        de: 'Süden',
        fr: 'Sud',
        ja: '南',
        cn: '下(南)',
        ko: '남쪽',
    },
    east: {
        en: 'East',
        de: 'Osten',
        fr: 'Est',
        ja: '東',
        cn: '右(东)',
        ko: '동쪽',
    },
    west: {
        en: 'West',
        de: 'Westen',
        fr: 'Ouest',
        ja: '西',
        cn: '左(西)',
        ko: '서쪽',
    },
    northwest: {
        en: 'Northwest',
        de: 'Nordwesten',
        fr: 'nord-ouest',
        ja: '北西',
        cn: '左上(西北)',
        ko: '북서',
    },
    northeast: {
        en: 'Northeast',
        de: 'Nordosten',
        fr: 'nord-est',
        ja: '北東',
        cn: '右上(东北)',
        ko: '북동',
    },
    southwest: {
        en: 'Southwest',
        de: 'Südwesten',
        fr: 'sud-ouest',
        ja: '南西',
        cn: '左下(西南)',
        ko: '남서',
    },
    southeast: {
        en: 'Southeast',
        de: 'Südosten',
        fr: 'sud-est',
        ja: '南東',
        cn: '右下(东南)',
        ko: '남동',
    },
    dirN: {
        en: 'N',
        de: 'N',
        fr: 'N',
        ja: '北',
        cn: '上(北)',
        ko: '북쪽',
    },
    dirS: {
        en: 'S',
        de: 'S',
        fr: 'S',
        ja: '南',
        cn: '下(南)',
        ko: '남쪽',
    },
    dirE: {
        en: 'E',
        de: 'O',
        fr: 'E',
        ja: '東',
        cn: '右(东)',
        ko: '동쪽',
    },
    dirW: {
        en: 'W',
        de: 'W',
        fr: 'O',
        ja: '西',
        cn: '左(西)',
        ko: '서쪽',
    },
    dirNW: {
        en: 'NW',
        de: 'NW',
        fr: 'NO',
        ja: '北西',
        cn: '左上(西北)',
        ko: '북서',
    },
    dirNE: {
        en: 'NE',
        de: 'NO',
        fr: 'NE',
        ja: '北東',
        cn: '右上(东北)',
        ko: '북동',
    },
    dirSW: {
        en: 'SW',
        de: 'SW',
        fr: 'SO',
        ja: '南西',
        cn: '左下(西南)',
        ko: '남서',
    },
    dirSE: {
        en: 'SE',
        de: 'SO',
        fr: 'SE',
        ja: '南東',
        cn: '右下(东南)',
        ko: '남동',
    },
    // Literal numbers.
    num0: numberToOutputString(0),
    num1: numberToOutputString(1),
    num2: numberToOutputString(2),
    num3: numberToOutputString(3),
    num4: numberToOutputString(4),
    num5: numberToOutputString(5),
    num6: numberToOutputString(6),
    num7: numberToOutputString(7),
    num8: numberToOutputString(8),
    num9: numberToOutputString(9),
});


/***/ }),

/***/ 906:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PS": () => (/* binding */ addOverlayListener),
/* harmony export */   "ae": () => (/* binding */ callOverlayHandler)
/* harmony export */ });
/* unused harmony exports dispatchOverlayEvent, removeOverlayListener, setCallOverlayHandlerOverride, init */
// OverlayPlugin API setup
let inited = false;
let wsUrl = null;
let ws = null;
let queue = [];
let rseqCounter = 0;
const responsePromises = {};
const subscribers = {};
const sendMessage = (msg, cb) => {
    if (ws) {
        if (queue)
            queue.push(msg);
        else
            ws.send(JSON.stringify(msg));
    }
    else {
        if (queue)
            queue.push([msg, cb]);
        else
            window.OverlayPluginApi.callHandler(JSON.stringify(msg), cb);
    }
};
const processEvent = (msg) => {
    init();
    const subs = subscribers[msg.type];
    subs === null || subs === void 0 ? void 0 : subs.forEach((sub) => sub(msg));
};
const dispatchOverlayEvent = processEvent;
const addOverlayListener = (event, cb) => {
    var _a;
    init();
    if (!subscribers[event]) {
        subscribers[event] = [];
        if (!queue) {
            sendMessage({
                call: 'subscribe',
                events: [event],
            });
        }
    }
    (_a = subscribers[event]) === null || _a === void 0 ? void 0 : _a.push(cb);
};
const removeOverlayListener = (event, cb) => {
    init();
    if (subscribers[event]) {
        const list = subscribers[event];
        const pos = list === null || list === void 0 ? void 0 : list.indexOf(cb);
        if (pos && pos > -1)
            list === null || list === void 0 ? void 0 : list.splice(pos, 1);
    }
};
const callOverlayHandlerInternal = (_msg) => {
    init();
    const msg = {
        ..._msg,
        rseq: 0,
    };
    let p;
    if (ws) {
        msg.rseq = rseqCounter++;
        p = new Promise((resolve) => {
            responsePromises[msg.rseq] = resolve;
        });
        sendMessage(msg);
    }
    else {
        p = new Promise((resolve) => {
            sendMessage(msg, (data) => {
                resolve(data === null ? null : JSON.parse(data));
            });
        });
    }
    return p;
};
let callOverlayHandlerOverride;
const callOverlayHandler = (_msg) => {
    init();
    if (callOverlayHandlerOverride) {
        return callOverlayHandlerOverride(_msg);
    }
    return callOverlayHandlerInternal(_msg);
};
const setCallOverlayHandlerOverride = (override) => {
    callOverlayHandlerOverride = override;
    return callOverlayHandlerInternal;
};
const init = () => {
    if (inited)
        return;
    if (typeof window !== 'undefined') {
        wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(window.location.href);
        if (wsUrl) {
            const connectWs = function () {
                ws = new WebSocket(wsUrl === null || wsUrl === void 0 ? void 0 : wsUrl[1]);
                ws.addEventListener('error', (e) => {
                    console.error(e);
                });
                ws.addEventListener('open', () => {
                    console.log('Connected!');
                    const q = queue !== null && queue !== void 0 ? queue : [];
                    queue = null;
                    sendMessage({
                        call: 'subscribe',
                        events: Object.keys(subscribers),
                    });
                    for (const msg of q) {
                        if (!Array.isArray(msg))
                            sendMessage(msg);
                    }
                });
                ws.addEventListener('message', (_msg) => {
                    var _a;
                    try {
                        const msg = JSON.parse(_msg.data);
                        if (msg.rseq !== undefined && responsePromises[msg.rseq]) {
                            (_a = responsePromises[msg.rseq]) === null || _a === void 0 ? void 0 : _a.call(responsePromises, msg);
                            delete responsePromises[msg.rseq];
                        }
                        else {
                            processEvent(msg);
                        }
                    }
                    catch (e) {
                        console.error('Invalid message received: ', _msg);
                        return;
                    }
                });
                ws.addEventListener('close', () => {
                    queue = null;
                    console.log('Trying to reconnect...');
                    // Don't spam the server with retries.
                    setTimeout(() => {
                        connectWs();
                    }, 300);
                });
            };
            connectWs();
        }
        else {
            const waitForApi = function () {
                if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
                    setTimeout(waitForApi, 300);
                    return;
                }
                const q = queue !== null && queue !== void 0 ? queue : [];
                queue = null;
                window.__OverlayCallback = processEvent;
                sendMessage({
                    call: 'subscribe',
                    events: Object.keys(subscribers),
                });
                for (const item of q) {
                    if (Array.isArray(item))
                        sendMessage(item[0], item[1]);
                }
            };
            waitForApi();
        }
        // Here the OverlayPlugin API is registered to the window object,
        // but this is mainly for backwards compatibility.For cactbot's built-in files,
        // it is recommended to use the various functions exported in resources/overlay_plugin_api.ts.
        window.addOverlayListener = addOverlayListener;
        window.removeOverlayListener = removeOverlayListener;
        window.callOverlayHandler = callOverlayHandler;
        window.dispatchOverlayEvent = dispatchOverlayEvent;
    }
    inited = true;
};


/***/ }),

/***/ 201:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Regexes)
/* harmony export */ });
const startsUsingParams = ['timestamp', 'source', 'id', 'ability', 'target', 'capture'];
const abilityParams = ['timestamp', 'source', 'sourceId', 'id', 'ability', 'targetId', 'target', 'capture'];
const abilityFullParams = [
    'timestamp',
    'sourceId',
    'source',
    'id',
    'ability',
    'targetId',
    'target',
    'flags',
    'flag0',
    'flag1',
    'flag2',
    'flag3',
    'flag4',
    'flag5',
    'flag6',
    'flag7',
    'flag8',
    'flag9',
    'flag10',
    'flag11',
    'flag12',
    'flag13',
    'flag14',
    'targetHp',
    'targetMaxHp',
    'targetMp',
    'targetMaxMp',
    'targetX',
    'targetY',
    'targetZ',
    'targetHeading',
    'hp',
    'maxHp',
    'mp',
    'maxMp',
    'x',
    'y',
    'z',
    'heading',
    'capture',
];
const headMarkerParams = ['timestamp', 'targetId', 'target', 'id', 'capture'];
const addedCombatantParams = ['timestamp', 'name', 'capture'];
const addedCombatantFullParams = [
    'timestamp',
    'id',
    'name',
    'job',
    'level',
    'hp',
    'x',
    'y',
    'z',
    'npcId',
    'capture',
];
const removingCombatantParams = [
    'timestamp',
    'id',
    'name',
    'hp',
    'x',
    'y',
    'z',
    'capture',
];
const gainsEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'duration', 'capture'];
const statusEffectExplicitParams = [
    'timestamp',
    'targetId',
    'target',
    'job',
    'hp',
    'maxHp',
    'mp',
    'maxMp',
    'x',
    'y',
    'z',
    'heading',
    'data0',
    'data1',
    'data2',
    'data3',
    'data4',
    'capture',
];
const losesEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'capture'];
const statChangeParams = [
    'timestamp',
    'job',
    'strength',
    'dexterity',
    'vitality',
    'intelligence',
    'mind',
    'piety',
    'attackPower',
    'directHit',
    'criticalHit',
    'attackMagicPotency',
    'healMagicPotency',
    'determination',
    'skillSpeed',
    'spellSpeed',
    'tenacity',
    'capture',
];
const tetherParams = ['timestamp', 'source', 'sourceId', 'target', 'targetId', 'id', 'capture'];
const wasDefeatedParams = ['timestamp', 'target', 'source', 'capture'];
const hasHPParams = ['timestamp', 'name', 'hp', 'capture'];
const echoParams = ['timestamp', 'code', 'line', 'capture'];
const dialogParams = ['timestamp', 'code', 'line', 'name', 'capture'];
const messageParams = ['timestamp', 'code', 'line', 'capture'];
const gameLogParams = ['timestamp', 'code', 'line', 'capture'];
const gameNameLogParams = ['timestamp', 'code', 'name', 'line', 'capture'];
const changeZoneParams = ['timestamp', 'name', 'capture'];
const network6dParams = ['timestamp', 'instance', 'command', 'data0', 'data1', 'data2', 'data3', 'capture'];
class Regexes {
    /**
     * fields: source, id, ability, target, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
     */
    static startsUsing(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'startsUsing', startsUsingParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 14:' +
            Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';
        if (f.source || f.id || f.target || capture)
            str += Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ' starts using ';
        if (f.ability || f.target || capture)
            str += Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ' on ';
        if (f.target || capture)
            str += Regexes.maybeCapture(capture, 'target', f.target, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: sourceId, source, id, ability, targetId, target, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static ability(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'ability', abilityParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1[56]:' + Regexes.maybeCapture(capture, 'sourceId', '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':';
        if (f.id || f.ability || f.target || f.targetId || capture)
            str += Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';
        if (f.ability || f.target || f.targetId || capture)
            str += Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':';
        if (f.target || f.targetId || capture)
            str += Regexes.maybeCapture(capture, 'targetId', '\\y{ObjectId}') + ':';
        if (f.target || capture)
            str += Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':';
        return Regexes.parse(str);
    }
    /**
     * fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static abilityFull(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'abilityFull', abilityFullParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1[56]:' +
            Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':' +
            Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flags', f.flags, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag0', f.flag0, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag1', f.flag1, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag2', f.flag2, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag3', f.flag3, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag4', f.flag4, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag5', f.flag5, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag6', f.flag6, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag7', f.flag7, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag8', f.flag8, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag9', f.flag9, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag10', f.flag10, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag11', f.flag11, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag12', f.flag12, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag13', f.flag13, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag14', f.flag13, '[^:]*?') + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetHp', f.targetHp, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxHp', f.targetMaxHp, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetMp', f.targetMp, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxMp', f.targetMaxMp, '\\y{Float}')) + ':' +
            Regexes.optional('\\y{Float}') + ':' + // Target TP
            Regexes.optional('\\y{Float}') + ':' + // Target Max TP
            Regexes.optional(Regexes.maybeCapture(capture, 'targetX', f.targetX, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetY', f.targetY, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetZ', f.targetZ, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetHeading', f.targetHeading, '\\y{Float}')) + ':' +
            Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
            '\\y{Float}:' + // Source TP
            '\\y{Float}:' + // Source Max TP
            Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}') + ':' +
            '.*?$'; // Unknown last field
        return Regexes.parse(str);
    }
    /**
     * fields: targetId, target, id, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
     */
    static headMarker(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'headMarker', headMarkerParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1B:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +
            Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
        return Regexes.parse(str);
    }
    // fields: name, capture
    // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
    static addedCombatant(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'addedCombatant', addedCombatantParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 03:\\y{ObjectId}:Added new combatant ' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: id, name, hp, x, y, z, npcId, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatantFull(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'addedCombatantFull', addedCombatantFullParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 03:' + Regexes.maybeCapture(capture, 'id', f.id, '\\y{ObjectId}') +
            ':Added new combatant ' + Regexes.maybeCapture(capture, 'name', f.name, '[^:]*?') +
            '\\. {2}Job: ' + Regexes.maybeCapture(capture, 'job', f.job, '[^:]*?') +
            ' Level: ' + Regexes.maybeCapture(capture, 'level', f.level, '[^:]*?') +
            ' Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
            '.*?Pos: \\(' +
            Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
            Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
            Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)' +
            '(?: \\(' + Regexes.maybeCapture(capture, 'npcId', f.npcId, '.*?') + '\\))?\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: id, name, hp, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
     */
    static removingCombatant(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'removingCombatant', removingCombatantParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 04:' + Regexes.maybeCapture(capture, 'id', '\\y{ObjectId}') +
            ':Removing combatant ' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
            '.*?Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
            Regexes.optional('.*?Pos: \\(' +
                Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
                Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
                Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)');
        return Regexes.parse(str);
    }
    // fields: targetId, target, effect, source, duration, capture
    // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
    static gainsEffect(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'gainsEffect', gainsEffectParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1A:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
            ' gains the effect of ' +
            Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
            ' from ' +
            Regexes.maybeCapture(capture, 'source', f.source, '.*?') +
            ' for ' +
            Regexes.maybeCapture(capture, 'duration', f.duration, '\\y{Float}') +
            ' Seconds\\.';
        return Regexes.parse(str);
    }
    /**
     * Prefer gainsEffect over this function unless you really need extra data.
     * fields: targetId, target, job, hp, maxHp, mp, maxMp, x, y, z, heading,
     *         data0, data1, data2, data3, data4
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
     */
    static statusEffectExplicit(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'statusEffectExplicit', statusEffectExplicitParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const kField = '.*?:';
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 26:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
            '[0-9A-F]{0,6}' + Regexes.maybeCapture(capture, 'job', f.job, '[0-9A-F]{0,2}') + ':' +
            Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
            kField + // tp lol
            kField + // max tp extra lol
            // x, y, z heading may be blank
            Regexes.optional(Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}')) + ':' +
            Regexes.maybeCapture(capture, 'data0', f.data0, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'data1', f.data1, '[^:]*?') + ':' +
            // data2, 3, 4 may not exist and the line may terminate.
            Regexes.optional(Regexes.maybeCapture(capture, 'data2', f.data2, '[^:]*?') + ':') +
            Regexes.optional(Regexes.maybeCapture(capture, 'data3', f.data3, '[^:]*?') + ':') +
            Regexes.optional(Regexes.maybeCapture(capture, 'data4', f.data4, '[^:]*?') + ':');
        return Regexes.parse(str);
    }
    /**
     * fields: targetId, target, effect, source, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
     */
    static losesEffect(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'losesEffect', losesEffectParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1E:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
            ' loses the effect of ' +
            Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
            ' from ' +
            Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: source, sourceId, target, targetId, id, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
     */
    static tether(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'tether', tetherParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 23:' +
            Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') +
            ':....:....:' +
            Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
        return Regexes.parse(str);
    }
    /**
     * 'target' was defeated by 'source'
     * fields: target, source, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
     */
    static wasDefeated(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'wasDefeated', wasDefeatedParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 19:' +
            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
            ' was defeated by ' +
            Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: name, hp, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0d-combatanthp
     */
    static hasHP(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'hasHP', hasHPParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 0D:' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') +
            ' HP at ' +
            Regexes.maybeCapture(capture, 'hp', f.hp, '\\d+') + '%';
        return Regexes.parse(str);
    }
    /**
     * fields: code, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static echo(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'echo', echoParams);
        return Regexes.gameLog({
            line: f.line,
            capture: f.capture,
            code: '0038',
        });
    }
    /**
     * fields: code, line, name, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static dialog(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'dialog', dialogParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 00:' +
            Regexes.maybeCapture(capture, 'code', '0044') + ':' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
        return Regexes.parse(str);
    }
    /**
     * fields: code, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static message(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'message', messageParams);
        return Regexes.gameLog({
            line: f.line,
            capture: f.capture,
            code: '0839',
        });
    }
    /**
     * fields: code, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameLog(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'gameLog', gameLogParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 00:' +
            Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
        return Regexes.parse(str);
    }
    /**
     * fields: code, name, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     * Some game log lines have names in them, but not all.  All network log lines for these
     * have empty fields, but these get dropped by the ACT FFXV plugin.
     */
    static gameNameLog(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'gameNameLog', gameNameLogParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 00:' +
            Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
            Regexes.maybeCapture(capture, 'name', f.name, '[^:]*') + ':' +
            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
        return Regexes.parse(str);
    }
    /**
     * fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,
     *         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,
     *         skillSpeed, spellSpeed, tenacity, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
     */
    static statChange(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'statChange', statChangeParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 0C:Player Stats: ' +
            Regexes.maybeCapture(capture, 'job', f.job, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'strength', f.strength, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'dexterity', f.dexterity, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'vitality', f.vitality, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'intelligence', f.intelligence, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'mind', f.mind, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'piety', f.piety, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'attackPower', f.attackPower, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'directHit', f.directHit, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'criticalHit', f.criticalHit, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'attackMagicPotency', f.attackMagicPotency, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'healMagicPotency', f.healMagicPotency, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'determination', f.determination, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'skillSpeed', f.skillSpeed, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'spellSpeed', f.spellSpeed, '\\d+') +
            ':0:' +
            Regexes.maybeCapture(capture, 'tenacity', f.tenacity, '\\d+');
        return Regexes.parse(str);
    }
    /**
     * fields: name, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
     */
    static changeZone(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'changeZone', changeZoneParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 01:Changed Zone to ' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: instance, command, data0, data1, data2, data3
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
     */
    static network6d(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'network6d', network6dParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 21:' +
            Regexes.maybeCapture(capture, 'instance', f.instance, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'command', f.command, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data2', f.data2, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data3', f.data3, '.*?') + '$';
        return Regexes.parse(str);
    }
    /**
     * Helper function for building named capture group
     */
    static maybeCapture(capture, name, value, defaultValue) {
        if (!value)
            value = defaultValue;
        value = Regexes.anyOf(value);
        return capture ? Regexes.namedCapture(name, value) : value;
    }
    static optional(str) {
        return `(?:${str})?`;
    }
    // Creates a named regex capture group named |name| for the match |value|.
    static namedCapture(name, value) {
        if (name.includes('>'))
            console.error('"' + name + '" contains ">".');
        if (name.includes('<'))
            console.error('"' + name + '" contains ">".');
        return '(?<' + name + '>' + value + ')';
    }
    /**
     * Convenience for turning multiple args into a unioned regular expression.
     * anyOf(x, y, z) or anyOf([x, y, z]) do the same thing, and return (?:x|y|z).
     * anyOf(x) or anyOf(x) on its own simplifies to just x.
     * args may be strings or RegExp, although any additional markers to RegExp
     * like /insensitive/i are dropped.
     */
    static anyOf(...args) {
        const anyOfArray = (array) => {
            return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;
        };
        let array = [];
        if (args.length === 1) {
            if (Array.isArray(args[0]))
                array = args[0];
            else if (args[0])
                array = [args[0]];
            else
                array = [];
        }
        else {
            // TODO: more accurate type instead of `as` cast
            array = args;
        }
        return anyOfArray(array);
    }
    static parse(regexpString) {
        const kCactbotCategories = {
            Timestamp: '^.{14}',
            NetTimestamp: '.{33}',
            NetField: '(?:[^|]*\\|)',
            LogType: '[0-9A-Fa-f]{2}',
            AbilityCode: '[0-9A-Fa-f]{1,8}',
            ObjectId: '[0-9A-F]{8}',
            // Matches any character name (including empty strings which the FFXIV
            // ACT plugin can generate when unknown).
            Name: '(?:[^\\s:|]+(?: [^\\s:|]+)?|)',
            // Floats can have comma as separator in FFXIV plugin output: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/137
            Float: '-?[0-9]+(?:[.,][0-9]+)?(?:E-?[0-9]+)?',
        };
        // All regexes in cactbot are case insensitive.
        // This avoids headaches as things like `Vice and Vanity` turns into
        // `Vice And Vanity`, especially for French and German.  It appears to
        // have a ~20% regex parsing overhead, but at least they work.
        let modifiers = 'i';
        if (regexpString instanceof RegExp) {
            modifiers += (regexpString.global ? 'g' : '') +
                (regexpString.multiline ? 'm' : '');
            regexpString = regexpString.source;
        }
        regexpString = regexpString.replace(/\\y\{(.*?)\}/g, (match, group) => {
            return kCactbotCategories[group] || match;
        });
        return new RegExp(regexpString, modifiers);
    }
    // Like Regex.Regexes.parse, but force global flag.
    static parseGlobal(regexpString) {
        const regex = Regexes.parse(regexpString);
        let modifiers = 'gi';
        if (regexpString instanceof RegExp)
            modifiers += (regexpString.multiline ? 'm' : '');
        return new RegExp(regex.source, modifiers);
    }
    static trueIfUndefined(value) {
        if (typeof (value) === 'undefined')
            return true;
        return !!value;
    }
    static validateParams(f, funcName, params) {
        if (f === null)
            return;
        if (typeof f !== 'object')
            return;
        const keys = Object.keys(f);
        for (let k = 0; k < keys.length; ++k) {
            const key = keys[k];
            if (key && !params.includes(key)) {
                throw new Error(`${funcName}: invalid parameter '${key}'.  ` +
                    `Valid params: ${JSON.stringify(params)}`);
            }
        }
    }
}


/***/ }),

/***/ 163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ug": () => (/* binding */ triggerOutputFunctions),
/* harmony export */   "n3": () => (/* binding */ Responses)
/* harmony export */ });
/* unused harmony exports builtInResponseStr, triggerFunctions, triggerTextOutputFunctions, severityMap */
/* harmony import */ var _outputs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(273);
// This is meant to be used in a trigger as such:
// {
//   id: 'Some tankbuster',
//   regex: Regexes.startsUsing({source: 'Ye Olde Bosse', id: '666'}),
//   condition: Conditions.caresAboutMagical(data),
//   response: Responses.tankbuster(),
// },
//
// Note: Breaking out the condition like this lets people override it if they
// always (or never) want to know about it, rather than hiding the logic inside
// the tankbuster callback with a "is healer" check.
//
// If data.role is used, it should be only to differentiate between alert levels,
// and not whether a message is sent at all.
//
// Although this is not true of `response: ` fields on triggers in general,
// all responses in this file should either return an object or a single
// function that sets outputStrings and returns an object without doing
// anything with data or matches.  See `responses_test.js`.

const builtInResponseStr = 'cactbot-builtin-response';
// All valid trigger fields.
const triggerFunctions = (/* unused pure expression or super */ null && ([
    'alarmText',
    'alertText',
    'condition',
    'delaySeconds',
    'disabled',
    'durationSeconds',
    'id',
    'infoText',
    'preRun',
    'promise',
    'response',
    'run',
    'sound',
    'soundVolume',
    'suppressSeconds',
    'tts',
    'outputStrings',
]));
// Trigger fields that can produce text output.
const triggerTextOutputFunctions = [
    'alarmText',
    'alertText',
    'infoText',
    'response',
    'tts',
];
// If a trigger has any of these, then it has a visible/audio effect.
const triggerOutputFunctions = [
    ...triggerTextOutputFunctions,
    'sound',
];
const severityMap = {
    'info': 'infoText',
    'alert': 'alertText',
    'alarm': 'alarmText',
};
const getText = (sev) => {
    if (!(sev in severityMap))
        throw new Error(`Invalid severity: ${sev}.`);
    return severityMap[sev];
};
const defaultInfoText = (sev) => {
    if (!sev)
        return 'infoText';
    return getText(sev);
};
const defaultAlertText = (sev) => {
    if (!sev)
        return 'alertText';
    return getText(sev);
};
const defaultAlarmText = (sev) => {
    if (!sev)
        return 'alarmText';
    return getText(sev);
};
const getTarget = (matches) => {
    // Often tankbusters can be casted by the boss on the boss.
    // Consider this as "not having a target".
    if (!matches || matches.target === matches.source)
        return;
    return matches.target;
};
const getSource = (matches) => {
    return matches === null || matches === void 0 ? void 0 : matches.source;
};
// FIXME: make this work for any number of pairs of params
const combineFuncs = function (text1, func1, text2, func2) {
    const obj = {};
    if (text1 !== text2) {
        obj[text1] = func1;
        obj[text2] = func2;
    }
    else {
        obj[text1] = (data, matches, output) => {
            return func1(data, matches, output) || func2(data, matches, output);
        };
    }
    return obj;
};
const isPlayerId = (id) => {
    return id && id[0] !== '4';
};
// For responses that unconditionally return static text.
const staticResponse = (field, text) => {
    return (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            text: text,
        };
        return {
            [field]: (_data, _matches, output) => { var _a; return (_a = output.text) === null || _a === void 0 ? void 0 : _a.call(output); },
        };
    };
};
const Responses = {
    tankBuster: (targetSev, otherSev) => {
        const outputStrings = {
            noTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBuster */ .Z.tankBuster,
            busterOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnYou */ .Z.tankBusterOnYou,
            busterOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnPlayer */ .Z.tankBusterOnPlayer,
        };
        const targetFunc = (data, matches, output) => {
            var _a, _b;
            const target = getTarget(matches);
            if (!target) {
                if (data.role !== 'tank' && data.role !== 'healer')
                    return;
                return (_a = output.noTarget) === null || _a === void 0 ? void 0 : _a.call(output);
            }
            if (target === data.me)
                return (_b = output.busterOnYou) === null || _b === void 0 ? void 0 : _b.call(output);
        };
        const otherFunc = (data, matches, output) => {
            var _a, _b;
            const target = getTarget(matches);
            if (!target) {
                if (data.role === 'tank' || data.role === 'healer')
                    return;
                return (_a = output.noTarget) === null || _a === void 0 ? void 0 : _a.call(output);
            }
            if (target === data.me)
                return;
            return (_b = output.busterOnTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultAlertText(targetSev), targetFunc, defaultInfoText(otherSev), otherFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    tankBusterSwap: (busterSev, swapSev) => {
        const outputStrings = {
            tankSwap: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankSwap */ .Z.tankSwap,
            busterOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnYou */ .Z.tankBusterOnYou,
            busterOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnPlayer */ .Z.tankBusterOnPlayer,
        };
        // Note: busterSev and swapSev can be the same priority.
        const tankSwapFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (data.role === 'tank' && target !== data.me)
                return (_a = output.tankSwap) === null || _a === void 0 ? void 0 : _a.call(output);
        };
        const busterFunc = (data, matches, output) => {
            var _a, _b;
            const target = getTarget(matches);
            if (data.role === 'tank' && target !== data.me)
                return;
            if (target === data.me)
                return (_a = output.busterOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
            return (_b = output.busterOnTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultAlarmText(swapSev), tankSwapFunc, defaultAlertText(busterSev), busterFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    tankCleave: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            cleaveOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankCleaveOnYou */ .Z.tankCleaveOnYou,
            cleaveNoTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankCleave */ .Z.tankCleave,
            avoidCleave: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.avoidTankCleave */ .Z.avoidTankCleave,
        };
        return {
            [defaultInfoText(sev)]: (data, matches, output) => {
                var _a, _b, _c;
                const target = getTarget(matches);
                if (target === data.me)
                    return (_a = output.cleaveOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
                if (data.role === 'tank' || data.job === 'BLU') {
                    // targetless tank cleave
                    // BLU players should always get this generic cleave message.
                    // We have no robust way to determine whether they have tank Mimicry on,
                    // and it's really annoying for a BLU tank to be told to avoid cleaves when they can't.
                    return (_b = output.cleaveNoTarget) === null || _b === void 0 ? void 0 : _b.call(output);
                }
                return (_c = output.avoidCleave) === null || _c === void 0 ? void 0 : _c.call(output);
            },
        };
    },
    miniBuster: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.miniBuster */ .Z.miniBuster),
    aoe: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.aoe */ .Z.aoe),
    bigAoe: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.bigAoe */ .Z.bigAoe),
    spread: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.spread */ .Z.spread),
    // for stack marker situations.
    stackMarker: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackMarker */ .Z.stackMarker),
    // for getting together without stack marker
    getTogether: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getTogether */ .Z.getTogether),
    stackMarkerOn: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            stackOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackOnYou */ .Z.stackOnYou,
            stackOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackOnPlayer */ .Z.stackOnPlayer,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a, _b;
                const target = getTarget(matches);
                if (target === data.me)
                    return (_a = output.stackOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
                return (_b = output.stackOnTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
            },
        };
    },
    stackMiddle: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackMiddle */ .Z.stackMiddle),
    doritoStack: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.doritoStack */ .Z.doritoStack),
    spreadThenStack: (sev) => {
        return staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.spreadThenStack */ .Z.spreadThenStack);
    },
    stackThenSpread: (sev) => {
        return staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackThenSpread */ .Z.stackThenSpread);
    },
    knockback: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.knockback */ .Z.knockback),
    knockbackOn: (targetSev, otherSev) => {
        const outputStrings = {
            knockbackOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.knockbackOnYou */ .Z.knockbackOnYou,
            knockbackOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.knockbackOnPlayer */ .Z.knockbackOnPlayer,
        };
        const targetFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (target === data.me)
                return (_a = output.knockbackOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
        };
        const otherFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (target !== data.me)
                return (_a = output.knockbackOnTarget) === null || _a === void 0 ? void 0 : _a.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultInfoText(targetSev), targetFunc, defaultInfoText(otherSev), otherFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    lookTowards: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookTowardsBoss */ .Z.lookTowardsBoss),
    lookAway: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookAway */ .Z.lookAway),
    lookAwayFromTarget: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            lookAwayFrom: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookAwayFromTarget */ .Z.lookAwayFromTarget,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a;
                const target = getTarget(matches);
                if (target === data.me)
                    return;
                const name = isPlayerId(matches === null || matches === void 0 ? void 0 : matches.targetId) ? data.ShortName(target) : target;
                return (_a = output.lookAwayFrom) === null || _a === void 0 ? void 0 : _a.call(output, { name: name });
            },
        };
    },
    lookAwayFromSource: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            lookAwayFrom: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookAwayFromTarget */ .Z.lookAwayFromTarget,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a;
                const source = getSource(matches);
                if (source === data.me)
                    return;
                const name = isPlayerId(matches === null || matches === void 0 ? void 0 : matches.sourceId) ? data.ShortName(source) : source;
                return (_a = output.lookAwayFrom) === null || _a === void 0 ? void 0 : _a.call(output, { name: name });
            },
        };
    },
    getBehind: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getBehind */ .Z.getBehind),
    goFrontOrSides: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.goFrontOrSides */ .Z.goFrontOrSides),
    // .getUnder() is used when you have to get into the bosses hitbox
    getUnder: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getUnder */ .Z.getUnder),
    // .getIn() is more like "get close but maybe even melee range is fine"
    getIn: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.in */ .Z.in),
    // .getOut() means get far away
    getOut: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.out */ .Z.out),
    outOfMelee: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.outOfMelee */ .Z.outOfMelee),
    getInThenOut: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.inThenOut */ .Z.inThenOut),
    getOutThenIn: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.outThenIn */ .Z.outThenIn),
    getBackThenFront: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.backThenFront */ .Z.backThenFront),
    getFrontThenBack: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.frontThenBack */ .Z.frontThenBack),
    goMiddle: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.goIntoMiddle */ .Z.goIntoMiddle),
    goRight: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.right */ .Z.right),
    goLeft: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.left */ .Z.left),
    goWest: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getLeftAndWest */ .Z.getLeftAndWest),
    goEast: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getRightAndEast */ .Z.getRightAndEast),
    goFrontBack: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.goFrontBack */ .Z.goFrontBack),
    goSides: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.sides */ .Z.sides),
    // .killAdds() is used for adds that will always be available
    killAdds: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.killAdds */ .Z.killAdds),
    // .killExtraAdd() is used for adds that appear if a mechanic was not played correctly
    killExtraAdd: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.killExtraAdd */ .Z.killExtraAdd),
    awayFromFront: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.awayFromFront */ .Z.awayFromFront),
    sleep: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            sleep: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.sleepTarget */ .Z.sleepTarget,
        };
        return {
            [defaultAlertText(sev)]: (_data, matches, output) => {
                var _a;
                const source = getSource(matches);
                return (_a = output.sleep) === null || _a === void 0 ? void 0 : _a.call(output, { name: source });
            },
        };
    },
    stun: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            stun: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stunTarget */ .Z.stunTarget,
        };
        return {
            [defaultAlertText(sev)]: (_data, matches, output) => {
                var _a;
                const source = getSource(matches);
                return (_a = output.stun) === null || _a === void 0 ? void 0 : _a.call(output, { name: source });
            },
        };
    },
    interrupt: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            interrupt: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.interruptTarget */ .Z.interruptTarget,
        };
        return {
            [defaultAlertText(sev)]: (_data, matches, output) => {
                var _a;
                const source = getSource(matches);
                return (_a = output.interrupt) === null || _a === void 0 ? void 0 : _a.call(output, { name: source });
            },
        };
    },
    preyOn: (targetSev, otherSev) => {
        const outputStrings = {
            preyOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.preyOnYou */ .Z.preyOnYou,
            preyOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.preyOnPlayer */ .Z.preyOnPlayer,
        };
        const targetFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (data.me === target)
                return (_a = output.preyOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
        };
        const otherFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (target !== data.me)
                return (_a = output.preyOnTarget) === null || _a === void 0 ? void 0 : _a.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultAlertText(targetSev), targetFunc, defaultInfoText(otherSev), otherFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    awayFrom: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            awayFromGroup: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.awayFromGroup */ .Z.awayFromGroup,
            awayFromTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.awayFromPlayer */ .Z.awayFromPlayer,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a, _b;
                const target = getTarget(matches);
                if (data.me === target)
                    return (_a = output.awayFromGroup) === null || _a === void 0 ? void 0 : _a.call(output);
                return (_b = output.awayFromTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
            },
        };
    },
    meteorOnYou: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.meteorOnYou */ .Z.meteorOnYou),
    stopMoving: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stopMoving */ .Z.stopMoving),
    stopEverything: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stopEverything */ .Z.stopEverything),
    // move away to dodge aoes
    moveAway: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.moveAway */ .Z.moveAway),
    // move around (e.g. jumping) to avoid being frozen
    moveAround: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.moveAround */ .Z.moveAround),
    breakChains: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.breakChains */ .Z.breakChains),
    moveChainsTogether: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.moveChainsTogether */ .Z.moveChainsTogether),
    earthshaker: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            earthshaker: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.earthshakerOnYou */ .Z.earthshakerOnYou,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a;
                const target = getTarget(matches);
                if (target !== data.me)
                    return;
                return (_a = output.earthshaker) === null || _a === void 0 ? void 0 : _a.call(output);
            },
        };
    },
    wakeUp: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.wakeUp */ .Z.wakeUp),
};
// Don't give `Responses` a type in its declaration so that it can be treated as more strict
// than `ResponsesMap`, but do assert that its type is correct.  This allows callers to know
// which properties are defined in Responses without having to conditionally check for undefined.
const responseMapTypeAssertion = Responses;
// Suppress unused variable warning.
console.assert(responseMapTypeAssertion);


/***/ }),

/***/ 970:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(906);
/* harmony import */ var _not_reached__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(500);
/* harmony import */ var _conditions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(152);
/* harmony import */ var _content_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _netregexes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(381);
/* harmony import */ var _regexes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(201);
/* harmony import */ var _responses__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(163);
/* harmony import */ var _outputs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(273);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(779);
/* harmony import */ var _zone_id__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(438);
/* harmony import */ var _zone_info__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(810);


// TODO:
// The convention of "import X as _X; const X = _X;" is currently
// being used as a method to workaround for downstream code
// that is running via eval(). Because importing statements do not
// create a variable of the same name, the eval()'d code does not know
// about the import, and thus throws ReferenceErrors.
// Used by downstream eval

const Conditions = _conditions__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z;

const ContentType = _content_type__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z;

const NetRegexes = _netregexes__WEBPACK_IMPORTED_MODULE_4__/* .default */ .Z;

const Regexes = _regexes__WEBPACK_IMPORTED_MODULE_5__/* .default */ .Z;

const Responses = _responses__WEBPACK_IMPORTED_MODULE_6__/* .Responses */ .n3;

const Outputs = _outputs__WEBPACK_IMPORTED_MODULE_7__/* .default */ .Z;

const Util = _util__WEBPACK_IMPORTED_MODULE_8__/* .default */ .Z;

const ZoneId = _zone_id__WEBPACK_IMPORTED_MODULE_9__/* .default */ .Z;

const ZoneInfo = _zone_info__WEBPACK_IMPORTED_MODULE_10__/* .default */ .Z;
// Convince TypeScript and eslint that these are used.  TypeScript doesn't have a great way
// to disable individual rules, so this is safer than disabling all rules.
console.assert(Conditions && ContentType && NetRegexes && Regexes &&
    Responses && Outputs && Util && ZoneId && ZoneInfo);
class UserConfig {
    constructor() {
        this.optionTemplates = {};
        this.savedConfig = {};
        this.userFileCallbacks = {};
    }
    getDefaultBaseOptions() {
        return {
            ParserLanguage: 'en',
            ShortLocale: 'en',
            DisplayLanguage: 'en',
            TextAlertsEnabled: true,
            SoundAlertsEnabled: true,
            SpokenAlertsEnabled: false,
            GroupSpokenAlertsEnabled: false,
        };
    }
    evalUserFile(content, options) {
        const Options = options;
        console.assert(Options); // Used by eval.
        // This is the one eval cactbot should ever need, which is for handling user files.
        // Because user files can be located anywhere on disk and there's backwards compat
        // issues, it's unlikely that these will be able to be anything but eval forever.
        //
        /* eslint-disable no-eval */
        eval(content);
        /* eslint-enable no-eval */
    }
    registerOptions(overlayName, optionTemplate, userFileCallback) {
        this.optionTemplates[overlayName] = optionTemplate;
        if (userFileCallback)
            this.userFileCallbacks[overlayName] = userFileCallback;
    }
    sortUserFiles(keys) {
        // Helper data structure for subdirectories.
        const splitKeyMap = {};
        for (const key of keys)
            splitKeyMap[key] = key.toUpperCase().split(/[/\\]/);
        // Sort paths as a depth-first case-insensitive alphabetical subdirectory walk, followed by
        // all files sorted case-insensitive alphabetically once a subdir has been processed, e.g.
        //  * a/some.js
        //  * b/subdir1/z/z/z/nested_file.js
        //  * b/subdir1/file.js
        //  * b/subdir2/first.js
        //  * b/subdir2/second.js
        //  * b/some_file.js
        //  * root_file1.js
        //  * root_file2.js
        return keys.sort((keyA, keyB) => {
            const listA = splitKeyMap[keyA];
            const listB = splitKeyMap[keyB];
            if (listA === undefined || listB === undefined)
                throw new _not_reached__WEBPACK_IMPORTED_MODULE_1__/* .UnreachableCode */ .$();
            const maxLen = Math.max(listA.length, listB.length);
            for (let idx = 0; idx < maxLen; ++idx) {
                const entryA = listA[idx];
                const entryB = listB[idx];
                // In practice, there's always at least one entry.
                if (entryA === undefined || entryB === undefined)
                    throw new _not_reached__WEBPACK_IMPORTED_MODULE_1__/* .UnreachableCode */ .$();
                // If both subdirectories or both files, then compare names.
                const isLastA = listA.length - 1 === idx;
                const isLastB = listB.length - 1 === idx;
                if (isLastA && isLastB) {
                    // If both last, then this is a filename comparison.
                    // First, compare filename without extension.
                    const fileA = entryA.replace(/\.[^\.]*$/, '');
                    const fileB = entryB.replace(/\.[^\.]*$/, '');
                    const filenameOnlyDiff = fileA.localeCompare(fileB);
                    if (filenameOnlyDiff)
                        return filenameOnlyDiff;
                    // Second, compare including the extension.
                    // Always return something here, see note below.
                    return entryA.localeCompare(entryB);
                }
                else if (!isLastA && !isLastB) {
                    // If both not last, this is a subdirectory comparison.
                    const diff = entryA.localeCompare(entryB);
                    if (diff)
                        return diff;
                }
                // At this point, if idx is the final for each, we would have returned above.
                // So, check if either a or b is at the final entry in splitKeyMap.
                // If so, then there's a mismatch in number of directories, and we know one
                // the one with a filename should be sorted last.
                if (listA.length - 1 <= idx) {
                    // a has fewer subdirectories, so should be sorted last.
                    return 1;
                }
                if (listB.length - 1 <= idx) {
                    // a has more subdirectories, so should be sorted first.
                    return -1;
                }
            }
            return 0;
        });
    }
    // Given a set of paths, an overlayName, and an extension, return all paths with
    // that extension that have `overlayName` either as their entire filename (no subdir)
    // or are inside a root-level subdirectory named `overlayName`/  The extension should
    // include the period separator, e.g. ".js".  All comparisons are case insensitive.
    filterUserFiles(paths, origOverlayName, origExtension) {
        const extension = origExtension.toLowerCase();
        const overlayName = origOverlayName.toLowerCase();
        return paths.filter((origPath) => {
            const path = origPath.toLowerCase();
            if (!path.endsWith(extension))
                return false;
            if (path === `${overlayName}${extension}`)
                return true;
            if (path.startsWith(`${overlayName}/`) || path.startsWith(`${overlayName}\\`))
                return true;
            return false;
        });
    }
    getUserConfigLocation(overlayName, options, callback) {
        let currentlyReloading = false;
        const reloadOnce = () => {
            if (currentlyReloading)
                return;
            currentlyReloading = true;
            window.location.reload();
        };
        (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .addOverlayListener */ .PS)('onUserFileChanged', () => {
            reloadOnce();
        });
        (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .addOverlayListener */ .PS)('onForceReload', () => {
            reloadOnce();
        });
        this.loadUserFiles(overlayName, options, callback);
    }
    loadUserFiles(overlayName, options, callback) {
        const readOptions = (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .callOverlayHandler */ .ae)({
            call: 'cactbotLoadData',
            overlay: 'options',
        });
        const loadUser = async (e) => {
            var _a, _b, _c, _d, _e, _f, _g;
            // The basePath isn't using for anything other than cosmetic printing of full paths,
            // so replace any slashes here for uniformity.  In case anybody is using cactbot on
            // Linux (?!?), support any style of slashes elsewhere.
            const basePath = e.detail.userLocation.replace(/[/\\]*$/, '') + '\\';
            const localFiles = e.detail.localUserFiles;
            // The plugin auto-detects the language, so set this first.
            // If options files want to override it, they can for testing.
            // Backward compatibility (language is now separated to three types.)
            if (e.detail.language) {
                options.ParserLanguage = e.detail.language;
                options.ShortLocale = e.detail.language;
                options.DisplayLanguage = e.detail.language;
            }
            // Parser Language
            if (e.detail.parserLanguage) {
                options.ParserLanguage = e.detail.parserLanguage;
                // Backward compatibility, everything "Language" should be changed to "ParserLanguage"
                options.Language = e.detail.parserLanguage;
            }
            const supportedLanguage = ['en', 'de', 'fr', 'ja', 'cn', 'ko'];
            // System Language
            if (e.detail.systemLocale) {
                options.SystemLocale = e.detail.systemLocale;
                options.ShortLocale = e.detail.systemLocale.substring(0, 2);
                if (options.ShortLocale === 'zh')
                    options.ShortLocale = 'cn';
                if (!supportedLanguage.includes(options.ShortLocale))
                    options.ShortLocale = options.ParserLanguage;
            }
            // User's setting Language
            options.DisplayLanguage = e.detail.displayLanguage;
            if (!supportedLanguage.includes(options.DisplayLanguage))
                options.DisplayLanguage = options.ParserLanguage || 'en';
            document.body.classList.add(`lang-${options.DisplayLanguage}`);
            this.addUnlockText(options.DisplayLanguage);
            // Handle processOptions after default language selection above,
            // but before css below which may load skin files.
            // processOptions needs to be called whether or not there are
            // any userOptions saved, as it sets up the defaults.
            this.savedConfig = (_b = (_a = (await readOptions)) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {};
            this.processOptions(options, (_c = this.savedConfig[overlayName]) !== null && _c !== void 0 ? _c : {}, this.optionTemplates[overlayName]);
            // If the overlay has a "Debug" setting, set to true via the config tool,
            // then also print out user files that have been loaded.
            const printUserFile = options.Debug ? (x) => console.log(x) : () => { };
            // With user files being arbitrary javascript, and having multiple files
            // in user folders, it's possible for later files to accidentally remove
            // things that previous files have added.  Warn about this, since most
            // users are not programmers.
            const warnOnVariableResetMap = {
                raidboss: [
                    'Triggers',
                ],
            };
            warnOnVariableResetMap[overlayName] = warnOnVariableResetMap[overlayName] || [];
            // The values of each `warnOnVariableResetMap` field are initially set
            // after the first file, so that if there is only one file, there are
            // not any warnings.
            // The fields that a user file sets in Options can be anything (pun not intended)
            // and so we use `any` here.  The only operation done on this field is a !==
            // for change detection to see if the the user file has modified it.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const variableTracker = {};
            if (localFiles) {
                // localFiles may be null if there is no valid user directory.
                const sortedFiles = this.sortUserFiles(Object.keys(localFiles));
                const jsFiles = this.filterUserFiles(sortedFiles, overlayName, '.js');
                const cssFiles = this.filterUserFiles(sortedFiles, overlayName, '.css');
                for (const jsFile of jsFiles) {
                    try {
                        printUserFile(`local user file: ${basePath}${jsFile}`);
                        this.evalUserFile((_d = localFiles[jsFile]) !== null && _d !== void 0 ? _d : '', options);
                        for (const field of (_e = warnOnVariableResetMap[overlayName]) !== null && _e !== void 0 ? _e : []) {
                            if (variableTracker[field] && variableTracker[field] !== options[field]) {
                                // Ideally users should do something like `Options.Triggers.push([etc]);`
                                // instead of `Options.Triggers = [etc];`
                                console.log(`*** WARNING: ${basePath}${jsFile} overwrites Options.${field} from previous files.`);
                            }
                            variableTracker[field] = options[field];
                        }
                        (_g = (_f = this.userFileCallbacks)[overlayName]) === null || _g === void 0 ? void 0 : _g.call(_f, jsFile, localFiles, options, basePath);
                    }
                    catch (e) {
                        // Be very visible for users.
                        console.log('*** ERROR IN USER FILE ***');
                        console.log(e);
                    }
                }
                // This is a bit awkward to handle skin settings here, but
                // doing it after user config files and before user css files
                // allows user css to override skin-specific css as well.
                if (options.Skin)
                    this.handleSkin(options.Skin);
                for (const cssFile of cssFiles) {
                    printUserFile(`local user file: ${basePath}${cssFile}`);
                    const userCssText = document.createElement('style');
                    const contents = localFiles[cssFile];
                    if (contents)
                        userCssText.innerText = contents;
                    const head = document.getElementsByTagName('head')[0];
                    if (head)
                        head.appendChild(userCssText);
                }
            }
            // Post this callback so that the js and css can be executed first.
            if (callback)
                callback();
            void (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .callOverlayHandler */ .ae)({ call: 'cactbotRequestState' });
        };
        void (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .callOverlayHandler */ .ae)({
            call: 'cactbotLoadUser',
            source: location.href,
            overlayName: overlayName,
        }).then((e) => {
            // Wait for DOMContentLoaded if needed.
            if (document.readyState !== 'loading') {
                void loadUser(e);
                return;
            }
            document.addEventListener('DOMContentLoaded', () => {
                void loadUser(e);
            });
        });
    }
    handleSkin(skinName) {
        if (!skinName || skinName === 'default')
            return;
        let basePath = document.location.toString();
        const slashIdx = basePath.lastIndexOf('/');
        if (slashIdx !== -1)
            basePath = basePath.substr(0, slashIdx);
        if (basePath.slice(-1) !== '/')
            basePath += '/';
        const skinHref = basePath + 'skins/' + skinName + '/' + skinName + '.css';
        this.appendCSSLink(skinHref);
    }
    appendJSLink(src) {
        const userJS = document.createElement('script');
        userJS.setAttribute('type', 'text/javascript');
        userJS.setAttribute('src', src);
        userJS.setAttribute('async', 'false');
        const head = document.getElementsByTagName('head')[0];
        if (head)
            head.appendChild(userJS);
    }
    appendCSSLink(href) {
        const userCSS = document.createElement('link');
        userCSS.setAttribute('rel', 'stylesheet');
        userCSS.setAttribute('type', 'text/css');
        userCSS.setAttribute('href', href);
        const head = document.getElementsByTagName('head')[0];
        if (head)
            head.appendChild(userCSS);
    }
    processOptions(options, savedConfig, template) {
        // Take options from the template, find them in savedConfig,
        // and apply them to options. This also handles setting
        // defaults for anything in the template, even if it does not
        // exist in savedConfig.
        if (Array.isArray(template)) {
            for (let i = 0; i < template.length; ++i)
                this.processOptions(options, savedConfig, template[i]);
            return;
        }
        // Not all overlays have option templates.
        if (!template)
            return;
        const templateOptions = template.options || [];
        for (const opt of templateOptions) {
            // Grab the saved value or the default to set in options.
            let value = opt.default;
            if (typeof savedConfig === 'object' && !Array.isArray(savedConfig)) {
                if (opt.id in savedConfig) {
                    const newValue = savedConfig[opt.id];
                    if (newValue !== undefined)
                        value = newValue;
                }
            }
            // Options can provide custom logic to turn a value into options settings.
            // If this doesn't exist, just set the value directly.
            // Option template ids are identical to field names on Options.
            if (opt.setterFunc) {
                opt.setterFunc(options, value);
            }
            else if (opt.type === 'integer') {
                if (typeof value === 'number')
                    options[opt.id] = Math.floor(value);
                else if (typeof value === 'string')
                    options[opt.id] = parseInt(value);
            }
            else if (opt.type === 'float') {
                if (typeof value === 'number')
                    options[opt.id] = value;
                else if (typeof value === 'string')
                    options[opt.id] = parseFloat(value);
            }
            else {
                options[opt.id] = value;
            }
        }
        // For things like raidboss that build extra UI, also give them a chance
        // to handle anything that has been set on that UI.
        if (template.processExtraOptions)
            template.processExtraOptions(options, savedConfig);
    }
    addUnlockText(lang) {
        const unlockText = {
            en: '🔓 Unlocked (lock overlay before using)',
            de: '🔓 Entsperrt (Sperre das Overlay vor der Nutzung)',
            fr: '🔓 Débloqué (Bloquez l\'overlay avant utilisation)',
            ja: '🔓 ロック解除 (オーバーレイを使用する前にロックしてください)',
            cn: '🔓 已解除锁定 (你需要将此悬浮窗锁定后方可使用)',
            ko: '🔓 위치 잠금 해제됨 (사용하기 전에 위치 잠금을 설정하세요)',
        };
        const id = 'cactbot-unlocked-text';
        let textElem = document.getElementById(id);
        if (!textElem) {
            textElem = document.createElement('div');
            textElem.id = id;
            textElem.classList.add('text');
            // Set element display to none in case the page has not included defaults.css.
            textElem.style.display = 'none';
            document.body.append(textElem);
        }
        textElem.innerHTML = unlockText[lang] || unlockText['en'];
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new UserConfig());
if (typeof document !== 'undefined') {
    // This event comes early and is not cached, so set up event listener immediately.
    document.addEventListener('onOverlayStateUpdate', (e) => {
        const docClassList = document.documentElement.classList;
        if (e.detail.isLocked)
            docClassList.remove('resizeHandle', 'unlocked');
        else
            docClassList.add('resizeHandle', 'unlocked');
    });
}


/***/ }),

/***/ 779:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// TODO: it'd be nice to not repeat job names, but at least Record enforces that all are set.
const nameToJobEnum = {
    NONE: 0,
    GLA: 1,
    PGL: 2,
    MRD: 3,
    LNC: 4,
    ARC: 5,
    CNJ: 6,
    THM: 7,
    CRP: 8,
    BSM: 9,
    ARM: 10,
    GSM: 11,
    LTW: 12,
    WVR: 13,
    ALC: 14,
    CUL: 15,
    MIN: 16,
    BTN: 17,
    FSH: 18,
    PLD: 19,
    MNK: 20,
    WAR: 21,
    DRG: 22,
    BRD: 23,
    WHM: 24,
    BLM: 25,
    ACN: 26,
    SMN: 27,
    SCH: 28,
    ROG: 29,
    NIN: 30,
    MCH: 31,
    DRK: 32,
    AST: 33,
    SAM: 34,
    RDM: 35,
    BLU: 36,
    GNB: 37,
    DNC: 38,
};
const allJobs = Object.keys(nameToJobEnum);
const allRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];
const tankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
const healerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
const meleeDpsJobs = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];
const rangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];
const casterDpsJobs = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
const dpsJobs = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
const craftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
const gatheringJobs = ['MIN', 'BTN', 'FSH'];
const stunJobs = ['BLU', ...tankJobs, ...meleeDpsJobs];
const silenceJobs = ['BLU', ...tankJobs, ...rangedDpsJobs];
const sleepJobs = ['BLM', 'BLU', ...healerJobs];
const feintJobs = [...meleeDpsJobs];
const addleJobs = [...casterDpsJobs];
const cleanseJobs = ['BLU', 'BRD', ...healerJobs];
const jobToRoleMap = (() => {
    const addToMap = (map, jobs, role) => {
        jobs.forEach((job) => map.set(job, role));
    };
    const map = new Map([['NONE', 'none']]);
    addToMap(map, tankJobs, 'tank');
    addToMap(map, healerJobs, 'healer');
    addToMap(map, dpsJobs, 'dps');
    addToMap(map, craftingJobs, 'crafter');
    addToMap(map, gatheringJobs, 'gatherer');
    return map;
})();
const Util = {
    jobEnumToJob: (id) => {
        const job = allJobs.find((job) => nameToJobEnum[job] === id);
        return job !== null && job !== void 0 ? job : 'NONE';
    },
    jobToJobEnum: (job) => nameToJobEnum[job],
    jobToRole: (job) => {
        const role = jobToRoleMap.get(job);
        return role !== null && role !== void 0 ? role : 'none';
    },
    getAllRoles: () => allRoles,
    isTankJob: (job) => tankJobs.includes(job),
    isHealerJob: (job) => healerJobs.includes(job),
    isMeleeDpsJob: (job) => meleeDpsJobs.includes(job),
    isRangedDpsJob: (job) => rangedDpsJobs.includes(job),
    isCasterDpsJob: (job) => casterDpsJobs.includes(job),
    isDpsJob: (job) => dpsJobs.includes(job),
    isCraftingJob: (job) => craftingJobs.includes(job),
    isGatheringJob: (job) => gatheringJobs.includes(job),
    isCombatJob: (job) => {
        return !craftingJobs.includes(job) && !gatheringJobs.includes(job);
    },
    canStun: (job) => stunJobs.includes(job),
    canSilence: (job) => silenceJobs.includes(job),
    canSleep: (job) => sleepJobs.includes(job),
    canCleanse: (job) => cleanseJobs.includes(job),
    canFeint: (job) => feintJobs.includes(job),
    canAddle: (job) => addleJobs.includes(job),
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Util);


/***/ }),

/***/ 438:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Auto-generated from gen_zone_id_and_info.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    'ABloodyReunion': 560,
    'ARelicRebornTheChimera': 368,
    'ARelicRebornTheHydra': 369,
    'ARequiemForHeroes': 830,
    'ASleepDisturbed': 914,
    'ASpectacleForTheAges': 533,
    'AccrueEnmityFromMultipleTargets': 540,
    'AirForceOne': 832,
    'AkadaemiaAnyder': 841,
    'AlaMhigo': 689,
    'AlexanderTheArmOfTheFather': 444,
    'AlexanderTheArmOfTheFatherSavage': 451,
    'AlexanderTheArmOfTheSon': 522,
    'AlexanderTheArmOfTheSonSavage': 531,
    'AlexanderTheBreathOfTheCreator': 581,
    'AlexanderTheBreathOfTheCreatorSavage': 585,
    'AlexanderTheBurdenOfTheFather': 445,
    'AlexanderTheBurdenOfTheFatherSavage': 452,
    'AlexanderTheBurdenOfTheSon': 523,
    'AlexanderTheBurdenOfTheSonSavage': 532,
    'AlexanderTheCuffOfTheFather': 443,
    'AlexanderTheCuffOfTheFatherSavage': 450,
    'AlexanderTheCuffOfTheSon': 521,
    'AlexanderTheCuffOfTheSonSavage': 530,
    'AlexanderTheEyesOfTheCreator': 580,
    'AlexanderTheEyesOfTheCreatorSavage': 584,
    'AlexanderTheFistOfTheFather': 442,
    'AlexanderTheFistOfTheFatherSavage': 449,
    'AlexanderTheFistOfTheSon': 520,
    'AlexanderTheFistOfTheSonSavage': 529,
    'AlexanderTheHeartOfTheCreator': 582,
    'AlexanderTheHeartOfTheCreatorSavage': 586,
    'AlexanderTheSoulOfTheCreator': 583,
    'AlexanderTheSoulOfTheCreatorSavage': 587,
    'AllsWellThatEndsInTheWell': 220,
    'AllsWellThatStartsWell': 796,
    'AlphascapeV10': 798,
    'AlphascapeV10Savage': 802,
    'AlphascapeV20': 799,
    'AlphascapeV20Savage': 803,
    'AlphascapeV30': 800,
    'AlphascapeV30Savage': 804,
    'AlphascapeV40': 801,
    'AlphascapeV40Savage': 805,
    'Amaurot': 838,
    'AmdaporKeep': 167,
    'AmdaporKeepHard': 189,
    'AmhAraeng': 815,
    'AnamnesisAnyder': 898,
    'AnnoyTheVoid': 222,
    'AsTheHeartBids': 894,
    'AssistAlliesInDefeatingATarget': 544,
    'Astragalos': 729,
    'AvoidAreaOfEffectAttacks': 537,
    'AzysLla': 402,
    'BaelsarsWall': 615,
    'BardamsMettle': 623,
    'BasicTrainingEnemyParties': 214,
    'BasicTrainingEnemyStrongholds': 215,
    'BattleInTheBigKeep': 396,
    'BattleOnTheBigBridge': 366,
    'BloodOnTheDeck': 708,
    'BrayfloxsLongstop': 158,
    'BrayfloxsLongstopHard': 362,
    'CapeWestwind': 332,
    'CastrumAbania': 661,
    'CastrumFluminis': 778,
    'CastrumMarinum': 934,
    'CastrumMarinumDrydocks': 967,
    'CastrumMarinumExtreme': 935,
    'CastrumMeridianum': 217,
    'CentralShroud': 148,
    'CentralThanalan': 141,
    'ChocoboRaceCostaDelSol': 389,
    'ChocoboRaceSagoliiRoad': 390,
    'ChocoboRaceTranquilPaths': 391,
    'ChocoboRaceTutorial': 417,
    'CinderDrift': 897,
    'CinderDriftExtreme': 912,
    'CoerthasCentralHighlands': 155,
    'CoerthasWesternHighlands': 397,
    'ComingClean': 860,
    'ContainmentBayP1T6': 576,
    'ContainmentBayP1T6Extreme': 577,
    'ContainmentBayS1T7': 517,
    'ContainmentBayS1T7Extreme': 524,
    'ContainmentBayZ1T9': 637,
    'ContainmentBayZ1T9Extreme': 638,
    'CopperbellMines': 161,
    'CopperbellMinesHard': 349,
    'CuriousGorgeMeetsHisMatch': 717,
    'CuttersCry': 170,
    'DarkAsTheNightSky': 713,
    'DeathUntoDawn': 977,
    'DefeatAnOccupiedTarget': 545,
    'DeltascapeV10': 691,
    'DeltascapeV10Savage': 695,
    'DeltascapeV20': 692,
    'DeltascapeV20Savage': 696,
    'DeltascapeV30': 693,
    'DeltascapeV30Savage': 697,
    'DeltascapeV40': 694,
    'DeltascapeV40Savage': 698,
    'DelubrumReginae': 936,
    'DelubrumReginaeSavage': 937,
    'DohnMheg': 821,
    'DomaCastle': 660,
    'DragonSound': 714,
    'DunScaith': 627,
    'DzemaelDarkhold': 171,
    'EastShroud': 152,
    'EasternLaNoscea': 137,
    'EasternThanalan': 145,
    'EdensGateDescent': 850,
    'EdensGateDescentSavage': 854,
    'EdensGateInundation': 851,
    'EdensGateInundationSavage': 855,
    'EdensGateResurrection': 849,
    'EdensGateResurrectionSavage': 853,
    'EdensGateSepulture': 852,
    'EdensGateSepultureSavage': 856,
    'EdensPromiseAnamorphosis': 944,
    'EdensPromiseAnamorphosisSavage': 948,
    'EdensPromiseEternity': 945,
    'EdensPromiseEternitySavage': 949,
    'EdensPromiseLitany': 943,
    'EdensPromiseLitanySavage': 947,
    'EdensPromiseUmbra': 942,
    'EdensPromiseUmbraSavage': 946,
    'EdensVerseFulmination': 902,
    'EdensVerseFulminationSavage': 906,
    'EdensVerseFuror': 903,
    'EdensVerseFurorSavage': 907,
    'EdensVerseIconoclasm': 904,
    'EdensVerseIconoclasmSavage': 908,
    'EdensVerseRefulgence': 905,
    'EdensVerseRefulgenceSavage': 909,
    'Emanation': 719,
    'EmanationExtreme': 720,
    'EmissaryOfTheDawn': 769,
    'EngageMultipleTargets': 541,
    'Eulmore': 820,
    'ExecuteAComboInBattle': 539,
    'ExecuteAComboToIncreaseEnmity': 538,
    'ExecuteARangedAttackToIncreaseEnmity': 542,
    'FadedMemories': 932,
    'FinalExercise': 552,
    'FitForAQueen': 955,
    'FlickingSticksAndTakingNames': 219,
    'Foundation': 418,
    'FourPlayerMahjongQuickMatchKuitanDisabled': 831,
    'Halatali': 162,
    'HalataliHard': 360,
    'HaukkeManor': 166,
    'HaukkeManorHard': 350,
    'HealAnAlly': 549,
    'HealMultipleAllies': 550,
    'HeavenOnHighFloors11_20': 771,
    'HeavenOnHighFloors1_10': 770,
    'HeavenOnHighFloors21_30': 772,
    'HeavenOnHighFloors31_40': 782,
    'HeavenOnHighFloors41_50': 773,
    'HeavenOnHighFloors51_60': 783,
    'HeavenOnHighFloors61_70': 774,
    'HeavenOnHighFloors71_80': 784,
    'HeavenOnHighFloors81_90': 775,
    'HeavenOnHighFloors91_100': 785,
    'HellsKier': 810,
    'HellsKierExtreme': 811,
    'HellsLid': 742,
    'HeroOnTheHalfShell': 216,
    'HiddenGorge': 791,
    'HolminsterSwitch': 837,
    'HullbreakerIsle': 361,
    'HullbreakerIsleHard': 557,
    'Idyllshire': 478,
    'IlMheg': 816,
    'InThalsName': 705,
    'InteractWithTheBattlefield': 548,
    'InterdimensionalRift': 690,
    'ItsProbablyATrap': 665,
    'Kholusia': 814,
    'Kugane': 628,
    'KuganeCastle': 662,
    'KuganeOhashi': 806,
    'Lakeland': 813,
    'LegendOfTheNotSoHiddenTemple': 859,
    'LimsaLominsaLowerDecks': 129,
    'LimsaLominsaUpperDecks': 128,
    'LongLiveTheQueen': 298,
    'LovmMasterTournament': 506,
    'LovmPlayerBattleNonRp': 591,
    'LovmPlayerBattleRp': 589,
    'LovmTournament': 590,
    'LowerLaNoscea': 135,
    'MalikahsWell': 836,
    'MatchAll': null,
    'MatoyasRelict': 933,
    'MatsubaMayhem': 710,
    'MemoriaMiseraExtreme': 913,
    'MessengerOfTheWinds': 834,
    'MiddleLaNoscea': 134,
    'Mist': 136,
    'MorDhona': 156,
    'MoreThanAFeeler': 221,
    'MtGulg': 822,
    'Naadam': 688,
    'Neverreap': 420,
    'NewGridania': 132,
    'NorthShroud': 154,
    'NorthernThanalan': 147,
    'NyelbertsLament': 876,
    'OceanFishing': 900,
    'OldGridania': 133,
    'OneLifeForOneWorld': 592,
    'OnsalHakairDanshigNaadam': 888,
    'OurCompromise': 716,
    'OurUnsungHeroes': 722,
    'OuterLaNoscea': 180,
    'Paglthan': 938,
    'PharosSirius': 160,
    'PharosSiriusHard': 510,
    'PullingPoisonPosies': 191,
    'RaisingTheSword': 706,
    'ReturnOfTheBull': 403,
    'RhalgrsReach': 635,
    'SaintMociannesArboretum': 511,
    'SaintMociannesArboretumHard': 788,
    'Sastasha': 157,
    'SastashaHard': 387,
    'SealRockSeize': 431,
    'ShadowAndClaw': 223,
    'ShisuiOfTheVioletTides': 616,
    'SigmascapeV10': 748,
    'SigmascapeV10Savage': 752,
    'SigmascapeV20': 749,
    'SigmascapeV20Savage': 753,
    'SigmascapeV30': 750,
    'SigmascapeV30Savage': 754,
    'SigmascapeV40': 751,
    'SigmascapeV40Savage': 755,
    'Snowcloak': 371,
    'SohmAl': 441,
    'SohmAlHard': 617,
    'SohrKhai': 555,
    'SolemnTrinity': 300,
    'SouthShroud': 153,
    'SouthernThanalan': 146,
    'SpecialEventI': 353,
    'SpecialEventIi': 354,
    'SpecialEventIii': 509,
    'StingingBack': 192,
    'SyrcusTower': 372,
    'TheAery': 435,
    'TheAetherochemicalResearchFacility': 438,
    'TheAkhAfahAmphitheatreExtreme': 378,
    'TheAkhAfahAmphitheatreHard': 377,
    'TheAkhAfahAmphitheatreUnreal': 930,
    'TheAntitower': 516,
    'TheAquapolis': 558,
    'TheAurumVale': 172,
    'TheAzimSteppe': 622,
    'TheBattleOnBekko': 711,
    'TheBindingCoilOfBahamutTurn1': 241,
    'TheBindingCoilOfBahamutTurn2': 242,
    'TheBindingCoilOfBahamutTurn3': 243,
    'TheBindingCoilOfBahamutTurn4': 244,
    'TheBindingCoilOfBahamutTurn5': 245,
    'TheBorderlandRuinsSecure': 376,
    'TheBowlOfEmbers': 202,
    'TheBowlOfEmbersExtreme': 295,
    'TheBowlOfEmbersHard': 292,
    'TheBozjaIncident': 911,
    'TheBozjanSouthernFront': 920,
    'TheBurn': 789,
    'TheCalamityRetold': 790,
    'TheCarteneauFlatsHeliodrome': 633,
    'TheChrysalis': 426,
    'TheChurningMists': 400,
    'TheCloudDeck': 950,
    'TheCloudDeckExtreme': 951,
    'TheCopiedFactory': 882,
    'TheCrownOfTheImmaculate': 846,
    'TheCrownOfTheImmaculateExtreme': 848,
    'TheCrystarium': 819,
    'TheDancingPlague': 845,
    'TheDancingPlagueExtreme': 858,
    'TheDiadem': 929,
    'TheDiademEasy': 512,
    'TheDiademHard': 515,
    'TheDiademHuntingGrounds': 625,
    'TheDiademHuntingGroundsEasy': 624,
    'TheDiademTrialsOfTheFury': 630,
    'TheDiademTrialsOfTheMatron': 656,
    'TheDomanEnclave': 759,
    'TheDragonsNeck': 142,
    'TheDravanianForelands': 398,
    'TheDravanianHinterlands': 399,
    'TheDrownedCityOfSkalla': 731,
    'TheDungeonsOfLyheGhiah': 879,
    'TheDuskVigil': 434,
    'TheDyingGasp': 847,
    'TheEpicOfAlexanderUltimate': 887,
    'TheFaceOfTrueEvil': 709,
    'TheFeastCustomMatchCrystalTower': 767,
    'TheFeastCustomMatchFeastingGrounds': 619,
    'TheFeastCustomMatchLichenweed': 646,
    'TheFeastRanked': 765,
    'TheFeastTeamRanked': 745,
    'TheFeastTraining': 766,
    'TheFieldsOfGloryShatter': 554,
    'TheFinalCoilOfBahamutTurn1': 193,
    'TheFinalCoilOfBahamutTurn2': 194,
    'TheFinalCoilOfBahamutTurn3': 195,
    'TheFinalCoilOfBahamutTurn4': 196,
    'TheFinalStepsOfFaith': 559,
    'TheForbiddenLandEurekaAnemos': 732,
    'TheForbiddenLandEurekaHydatos': 827,
    'TheForbiddenLandEurekaPagos': 763,
    'TheForbiddenLandEurekaPyros': 795,
    'TheFractalContinuum': 430,
    'TheFractalContinuumHard': 743,
    'TheFringes': 612,
    'TheGhimlytDark': 793,
    'TheGrandCosmos': 884,
    'TheGreatGubalLibrary': 416,
    'TheGreatGubalLibraryHard': 578,
    'TheGreatHunt': 761,
    'TheGreatHuntExtreme': 762,
    'TheGreatShipVylbrand': 954,
    'TheHardenedHeart': 873,
    'TheHauntedManor': 571,
    'TheHeartOfTheProblem': 718,
    'TheHeroesGauntlet': 916,
    'TheHiddenCanalsOfUznair': 725,
    'TheHowlingEye': 208,
    'TheHowlingEyeExtreme': 297,
    'TheHowlingEyeHard': 294,
    'TheHuntersLegacy': 875,
    'TheJadeStoa': 746,
    'TheJadeStoaExtreme': 758,
    'TheKeeperOfTheLake': 150,
    'TheLabyrinthOfTheAncients': 174,
    'TheLimitlessBlueExtreme': 447,
    'TheLimitlessBlueHard': 436,
    'TheLochs': 621,
    'TheLostAndTheFound': 874,
    'TheLostCanalsOfUznair': 712,
    'TheLostCityOfAmdapor': 363,
    'TheLostCityOfAmdaporHard': 519,
    'TheMinstrelsBalladHadessElegy': 885,
    'TheMinstrelsBalladNidhoggsRage': 566,
    'TheMinstrelsBalladShinryusDomain': 730,
    'TheMinstrelsBalladThordansReign': 448,
    'TheMinstrelsBalladTsukuyomisPain': 779,
    'TheMinstrelsBalladUltimasBane': 348,
    'TheNavel': 206,
    'TheNavelExtreme': 296,
    'TheNavelHard': 293,
    'TheNavelUnreal': 953,
    'TheOrbonneMonastery': 826,
    'TheOrphansAndTheBrokenBlade': 715,
    'ThePalaceOfTheDeadFloors101_110': 598,
    'ThePalaceOfTheDeadFloors111_120': 599,
    'ThePalaceOfTheDeadFloors11_20': 562,
    'ThePalaceOfTheDeadFloors121_130': 600,
    'ThePalaceOfTheDeadFloors131_140': 601,
    'ThePalaceOfTheDeadFloors141_150': 602,
    'ThePalaceOfTheDeadFloors151_160': 603,
    'ThePalaceOfTheDeadFloors161_170': 604,
    'ThePalaceOfTheDeadFloors171_180': 605,
    'ThePalaceOfTheDeadFloors181_190': 606,
    'ThePalaceOfTheDeadFloors191_200': 607,
    'ThePalaceOfTheDeadFloors1_10': 561,
    'ThePalaceOfTheDeadFloors21_30': 563,
    'ThePalaceOfTheDeadFloors31_40': 564,
    'ThePalaceOfTheDeadFloors41_50': 565,
    'ThePalaceOfTheDeadFloors51_60': 593,
    'ThePalaceOfTheDeadFloors61_70': 594,
    'ThePalaceOfTheDeadFloors71_80': 595,
    'ThePalaceOfTheDeadFloors81_90': 596,
    'ThePalaceOfTheDeadFloors91_100': 597,
    'ThePeaks': 620,
    'ThePillars': 419,
    'ThePoolOfTribute': 674,
    'ThePoolOfTributeExtreme': 677,
    'ThePraetorium': 224,
    'ThePuppetsBunker': 917,
    'TheQitanaRavel': 823,
    'TheRaktikaGreatwood': 817,
    'TheResonant': 684,
    'TheRidoranaLighthouse': 776,
    'TheRoyalCityOfRabanastre': 734,
    'TheRoyalMenagerie': 679,
    'TheRubySea': 613,
    'TheSeaOfClouds': 401,
    'TheSeatOfSacrifice': 922,
    'TheSeatOfSacrificeExtreme': 923,
    'TheSecondCoilOfBahamutSavageTurn1': 380,
    'TheSecondCoilOfBahamutSavageTurn2': 381,
    'TheSecondCoilOfBahamutSavageTurn3': 382,
    'TheSecondCoilOfBahamutSavageTurn4': 383,
    'TheSecondCoilOfBahamutTurn1': 355,
    'TheSecondCoilOfBahamutTurn2': 356,
    'TheSecondCoilOfBahamutTurn3': 357,
    'TheSecondCoilOfBahamutTurn4': 358,
    'TheShiftingAltarsOfUznair': 794,
    'TheShiftingOubliettesOfLyheGhiah': 924,
    'TheSingularityReactor': 437,
    'TheSirensongSea': 626,
    'TheStepsOfFaith': 143,
    'TheStoneVigil': 168,
    'TheStoneVigilHard': 365,
    'TheStrikingTreeExtreme': 375,
    'TheStrikingTreeHard': 374,
    'TheSunkenTempleOfQarn': 163,
    'TheSunkenTempleOfQarnHard': 367,
    'TheSwallowsCompass': 768,
    'TheTamTaraDeepcroft': 164,
    'TheTamTaraDeepcroftHard': 373,
    'TheTempest': 818,
    'TheTempleOfTheFist': 663,
    'TheThousandMawsOfTotoRak': 169,
    'TheTowerAtParadigmsBreach': 966,
    'TheTripleTriadBattlehall': 579,
    'TheTwinning': 840,
    'TheUnendingCoilOfBahamutUltimate': 733,
    'TheValentionesCeremony': 741,
    'TheVault': 421,
    'TheVoidArk': 508,
    'TheWanderersPalace': 159,
    'TheWanderersPalaceHard': 188,
    'TheWeaponsRefrainUltimate': 777,
    'TheWeepingCityOfMhach': 556,
    'TheWhorleaterExtreme': 359,
    'TheWhorleaterHard': 281,
    'TheWhorleaterUnreal': 972,
    'TheWillOfTheMoon': 797,
    'TheWorldOfDarkness': 151,
    'TheWreathOfSnakes': 824,
    'TheWreathOfSnakesExtreme': 825,
    'ThokAstThokExtreme': 446,
    'ThokAstThokHard': 432,
    'ThornmarchExtreme': 364,
    'ThornmarchHard': 207,
    'TripleTriadInvitationalParlor': 941,
    'TripleTriadOpenTournament': 940,
    'UldahStepsOfNald': 130,
    'UldahStepsOfThal': 131,
    'UnderTheArmor': 190,
    'UpperLaNoscea': 139,
    'UrthsFount': 394,
    'VowsOfVirtueDeedsOfCruelty': 893,
    'WardUp': 299,
    'WesternLaNoscea': 138,
    'WesternThanalan': 140,
    'WhenClansCollide': 723,
    'WithHeartAndSteel': 707,
    'WolvesDenPier': 250,
    'Xelphatol': 572,
    'Yanxia': 614,
    'Zadnor': 975,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data);


/***/ }),

/***/ 810:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Auto-generated from gen_zone_id_and_info.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    128: {
        'exVersion': 0,
        'name': {
            'cn': '利姆萨·罗敏萨上层甲板',
            'de': 'Obere Decks',
            'en': 'Limsa Lominsa Upper Decks',
            'fr': 'Limsa Lominsa - Le Tillac',
            'ja': 'リムサ・ロミンサ：上甲板層',
            'ko': '림사 로민사 상층 갑판',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 14,
    },
    129: {
        'exVersion': 0,
        'name': {
            'cn': '利姆萨·罗敏萨下层甲板',
            'de': 'Untere Decks',
            'en': 'Limsa Lominsa Lower Decks',
            'fr': 'Limsa Lominsa - L\'Entrepont',
            'ja': 'リムサ・ロミンサ：下甲板層',
            'ko': '림사 로민사 하층 갑판',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 15,
    },
    130: {
        'exVersion': 0,
        'name': {
            'cn': '乌尔达哈现世回廊',
            'de': 'Nald-Kreuzgang',
            'en': 'Ul\'dah - Steps of Nald',
            'fr': 'Ul\'dah - Faubourg de Nald',
            'ja': 'ウルダハ：ナル回廊',
            'ko': '울다하 날 회랑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 7,
    },
    131: {
        'exVersion': 0,
        'name': {
            'cn': '乌尔达哈来生回廊',
            'de': 'Thal-Kreuzgang',
            'en': 'Ul\'dah - Steps of Thal',
            'fr': 'Ul\'dah - Faubourg de Thal',
            'ja': 'ウルダハ：ザル回廊',
            'ko': '울다하 달 회랑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 8,
    },
    132: {
        'exVersion': 0,
        'name': {
            'cn': '格里达尼亚新街',
            'de': 'Neu-Gridania',
            'en': 'New Gridania',
            'fr': 'Nouvelle Gridania',
            'ja': 'グリダニア：新市街',
            'ko': '그리다니아 신시가지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 1,
    },
    133: {
        'exVersion': 0,
        'name': {
            'cn': '格里达尼亚旧街',
            'de': 'Alt-Gridania',
            'en': 'Old Gridania',
            'fr': 'Vieille Gridania',
            'ja': 'グリダニア：旧市街',
            'ko': '그리다니아 구시가지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 2,
    },
    134: {
        'exVersion': 0,
        'name': {
            'cn': '中拉诺西亚',
            'de': 'Zentrales La Noscea',
            'en': 'Middle La Noscea',
            'fr': 'Noscea centrale',
            'ja': '中央ラノシア',
            'ko': '중부 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 16,
    },
    135: {
        'exVersion': 0,
        'name': {
            'cn': '拉诺西亚低地',
            'de': 'Unteres La Noscea',
            'en': 'Lower La Noscea',
            'fr': 'Basse-Noscea',
            'ja': '低地ラノシア',
            'ko': '저지 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 17,
    },
    136: {
        'exVersion': 0,
        'name': {
            'cn': '海雾村',
            'de': 'Dorf des Nebels',
            'en': 'Mist',
            'fr': 'Brumée',
            'ja': 'ミスト・ヴィレッジ',
            'ko': '안갯빛 마을',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 14,
    },
    137: {
        'exVersion': 0,
        'name': {
            'cn': '东拉诺西亚',
            'de': 'Östliches La Noscea',
            'en': 'Eastern La Noscea',
            'fr': 'Noscea orientale',
            'ja': '東ラノシア',
            'ko': '동부 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 18,
    },
    138: {
        'exVersion': 0,
        'name': {
            'cn': '西拉诺西亚',
            'de': 'Westliches La Noscea',
            'en': 'Western La Noscea',
            'fr': 'Noscea occidentale',
            'ja': '西ラノシア',
            'ko': '서부 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 19,
    },
    139: {
        'exVersion': 0,
        'name': {
            'cn': '拉诺西亚高地',
            'de': 'Oberes La Noscea',
            'en': 'Upper La Noscea',
            'fr': 'Haute-Noscea',
            'ja': '高地ラノシア',
            'ko': '고지 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 20,
    },
    140: {
        'exVersion': 0,
        'name': {
            'cn': '西萨纳兰',
            'de': 'Westliches Thanalan',
            'en': 'Western Thanalan',
            'fr': 'Thanalan occidental',
            'ja': '西ザナラーン',
            'ko': '서부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 9,
    },
    141: {
        'exVersion': 0,
        'name': {
            'cn': '中萨纳兰',
            'de': 'Zentrales Thanalan',
            'en': 'Central Thanalan',
            'fr': 'Thanalan central',
            'ja': '中央ザナラーン',
            'ko': '중부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 10,
    },
    142: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '艾玛吉娜杯斗技大会决赛',
            'de': 'Das Drachenhals-Kolosseum',
            'en': 'The Dragon\'s Neck',
            'fr': 'Le Col du dragon',
            'ja': 'アマジナ杯闘技会決勝戦',
            'ko': '아마지나배 투기대회 결승전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    143: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '皇都伊修加德保卫战',
            'de': 'Der Schicksalsweg',
            'en': 'The Steps of Faith',
            'fr': 'Le Siège de la sainte Cité d\'Ishgard',
            'ja': '皇都イシュガルド防衛戦',
            'ko': '성도 이슈가르드 방어전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    145: {
        'exVersion': 0,
        'name': {
            'cn': '东萨纳兰',
            'de': 'Östliches Thanalan',
            'en': 'Eastern Thanalan',
            'fr': 'Thanalan oriental',
            'ja': '東ザナラーン',
            'ko': '동부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 11,
    },
    146: {
        'exVersion': 0,
        'name': {
            'cn': '南萨纳兰',
            'de': 'Südliches Thanalan',
            'en': 'Southern Thanalan',
            'fr': 'Thanalan méridional',
            'ja': '南ザナラーン',
            'ko': '남부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 12,
    },
    147: {
        'exVersion': 0,
        'name': {
            'cn': '北萨纳兰',
            'de': 'Nördliches Thanalan',
            'en': 'Northern Thanalan',
            'fr': 'Thanalan septentrional',
            'ja': '北ザナラーン',
            'ko': '북부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 13,
    },
    148: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林中央林区',
            'de': 'Tiefer Wald',
            'en': 'Central Shroud',
            'fr': 'Forêt centrale',
            'ja': '黒衣森：中央森林',
            'ko': '검은장막 숲 중부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 3,
    },
    150: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '幻龙残骸密约之塔',
            'de': 'Hüter des Sees',
            'en': 'The Keeper of the Lake',
            'fr': 'Le Gardien du lac',
            'ja': '幻龍残骸 黙約の塔',
            'ko': '묵약의 탑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 74,
    },
    151: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '水晶塔 暗之世界',
            'de': 'Die Welt der Dunkelheit',
            'en': 'The World of Darkness',
            'fr': 'La Tour de Cristal - Monde des Ténèbres',
            'ja': 'クリスタルタワー：闇の世界',
            'ko': '크리스탈 타워: 어둠의 세계',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    152: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林东部林区',
            'de': 'Ostwald',
            'en': 'East Shroud',
            'fr': 'Forêt de l\'est',
            'ja': '黒衣森：東部森林',
            'ko': '검은장막 숲 동부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 4,
    },
    153: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林南部林区',
            'de': 'Südwald',
            'en': 'South Shroud',
            'fr': 'Forêt du sud',
            'ja': '黒衣森：南部森林',
            'ko': '검은장막 숲 남부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 5,
    },
    154: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林北部林区',
            'de': 'Nordwald',
            'en': 'North Shroud',
            'fr': 'Forêt du nord',
            'ja': '黒衣森：北部森林',
            'ko': '검은장막 숲 북부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 6,
    },
    155: {
        'exVersion': 0,
        'name': {
            'cn': '库尔札斯中央高地',
            'de': 'Zentrales Hochland von Coerthas',
            'en': 'Coerthas Central Highlands',
            'fr': 'Hautes terres du Coerthas central',
            'ja': 'クルザス中央高地',
            'ko': '커르다스 중앙고지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    156: {
        'exVersion': 0,
        'name': {
            'cn': '摩杜纳',
            'de': 'Mor Dhona',
            'en': 'Mor Dhona',
            'fr': 'Mor Dhona',
            'ja': 'モードゥナ',
            'ko': '모르도나',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 22,
    },
    157: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '天然要害沙斯塔夏溶洞',
            'de': 'Sastasha',
            'en': 'Sastasha',
            'fr': 'Sastasha',
            'ja': '天然要害 サスタシャ浸食洞',
            'ko': '사스타샤 침식 동굴',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    158: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '休养胜地布雷福洛克斯野营地',
            'de': 'Brüllvolx\' Langrast',
            'en': 'Brayflox\'s Longstop',
            'fr': 'Le Bivouac de Brayflox',
            'ja': '奪還支援 ブレイフロクスの野営地',
            'ko': '브레이플록스의 야영지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    159: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '神灵圣域放浪神古神殿',
            'de': 'Palast des Wanderers',
            'en': 'The Wanderer\'s Palace',
            'fr': 'Le Palais du Vagabond',
            'ja': '旅神聖域 ワンダラーパレス',
            'ko': '방랑자의 궁전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    160: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '领航明灯天狼星灯塔',
            'de': 'Pharos Sirius',
            'en': 'Pharos Sirius',
            'fr': 'Le Phare de Sirius',
            'ja': '怪鳥巨塔 シリウス大灯台',
            'ko': '시리우스 대등대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    161: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '封锁坑道铜铃铜山',
            'de': 'Kupferglocken-Mine',
            'en': 'Copperbell Mines',
            'fr': 'Les Mines de Clochecuivre',
            'ja': '封鎖坑道 カッパーベル銅山',
            'ko': '구리종 광산',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    162: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '魔兽领域日影地修炼所',
            'de': 'Halatali',
            'en': 'Halatali',
            'fr': 'Halatali',
            'ja': '魔獣領域 ハラタリ修練所',
            'ko': '할라탈리 수련장',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    163: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '古代遗迹喀恩埋没圣堂',
            'de': 'Versunkener Tempel von Qarn',
            'en': 'The Sunken Temple of Qarn',
            'fr': 'Le Temple enseveli de Qarn',
            'ja': '遺跡探索 カルン埋没寺院',
            'ko': '카른의 무너진 사원',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    164: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '地下灵殿塔姆·塔拉墓园',
            'de': 'Totenacker Tam-Tara',
            'en': 'The Tam–Tara Deepcroft',
            'fr': 'L\'Hypogée de Tam-Tara',
            'ja': '地下霊殿 タムタラの墓所',
            'ko': '탐타라 묘소',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 300,
        'weatherRate': 0,
    },
    166: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '名门府邸静语庄园',
            'de': 'Haukke-Herrenhaus',
            'en': 'Haukke Manor',
            'fr': 'Le Manoir des Haukke',
            'ja': '名門屋敷 ハウケタ御用邸',
            'ko': '하우케타 별궁',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    167: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '邪教驻地无限城古堡',
            'de': 'Die Ruinen von Amdapor',
            'en': 'Amdapor Keep',
            'fr': 'Le Château d\'Amdapor',
            'ja': '邪教排撃 古城アムダプール',
            'ko': '옛 암다포르 성',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    168: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '对龙城塞石卫塔',
            'de': 'Steinerne Wacht',
            'en': 'The Stone Vigil',
            'fr': 'Le Vigile de Pierre',
            'ja': '城塞攻略 ストーンヴィジル',
            'ko': '돌방패 경계초소',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 27,
    },
    169: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '监狱废墟托托·拉克千狱',
            'de': 'Tausend Löcher von Toto-Rak',
            'en': 'The Thousand Maws of Toto–Rak',
            'fr': 'Les Mille Gueules de Toto-Rak',
            'ja': '監獄廃墟 トトラクの千獄',
            'ko': '토토라크 감옥',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    170: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '流沙迷宫樵鸣洞',
            'de': 'Sägerschrei',
            'en': 'Cutter\'s Cry',
            'fr': 'Le Gouffre hurlant',
            'ja': '流砂迷宮 カッターズクライ',
            'ko': '나무꾼의 비명',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    171: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '山中战线泽梅尔要塞',
            'de': 'Die Feste Dzemael',
            'en': 'Dzemael Darkhold',
            'fr': 'La Forteresse de Dzemael',
            'ja': '掃討作戦 ゼーメル要塞',
            'ko': '제멜 요새',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    172: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '毒雾洞窟黄金谷',
            'de': 'Goldklamm',
            'en': 'The Aurum Vale',
            'fr': 'Le Val d\'Aurum',
            'ja': '霧中行軍 オーラムヴェイル',
            'ko': '금빛 골짜기',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    174: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '水晶塔 古代人迷宫',
            'de': 'Kristallturm - Das Labyrinth der Alten',
            'en': 'The Labyrinth of the Ancients',
            'fr': 'La Tour de Cristal - Dédale antique',
            'ja': 'クリスタルタワー：古代の民の迷宮',
            'ko': '크리스탈 타워: 고대인의 미궁',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    180: {
        'exVersion': 0,
        'name': {
            'cn': '拉诺西亚外地',
            'de': 'Äußeres La Noscea',
            'en': 'Outer La Noscea',
            'fr': 'Noscea extérieure',
            'ja': '外地ラノシア',
            'ko': '외지 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 24,
    },
    188: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '武装圣域放浪神古神殿',
            'de': 'Palast des Wanderers (schwer)',
            'en': 'The Wanderer\'s Palace (Hard)',
            'fr': 'Le Palais du Vagabond (brutal)',
            'ja': '武装聖域 ワンダラーパレス (Hard)',
            'ko': '방랑자의 궁전(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    189: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '邪念妖地无限城古堡',
            'de': 'Die Ruinen von Amdapor (schwer)',
            'en': 'Amdapor Keep (Hard)',
            'fr': 'Le Château d\'Amdapor (brutal)',
            'ja': '邪念排撃 古城アムダプール (Hard)',
            'ko': '옛 암다포르 성(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    190: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐彷徨死灵！',
            'de': 'Bockmanns Gefolge',
            'en': 'Under the Armor',
            'fr': 'Chasse au fantôme fantoche',
            'ja': '彷徨う死霊を討て！',
            'ko': '방황하는 사령을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 3,
    },
    191: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '驱除剧毒妖花！',
            'de': 'Unkraut jäten',
            'en': 'Pulling Poison Posies',
            'fr': 'Opération fleurs du mal',
            'ja': '有毒妖花を駆除せよ！',
            'ko': '독성 요괴꽃을 제거하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 4,
    },
    192: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '消灭恶徒团伙寄生蜂团！',
            'de': 'Ins Wespennest stechen',
            'en': 'Stinging Back',
            'fr': 'Expédition punitive contre les Ventrerouge',
            'ja': '無法者「似我蜂団」を撃滅せよ！',
            'ko': '무법자 집단 \'나나니단\'을 섬멸하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 5,
    },
    193: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章1',
            'de': 'Verschlungene Schatten 3 - 1',
            'en': 'The Final Coil of Bahamut - Turn 1',
            'fr': 'L\'Abîme de Bahamut I',
            'ja': '大迷宮バハムート：真成編1',
            'ko': '대미궁 바하무트: 진성편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    194: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章2',
            'de': 'Verschlungene Schatten 3 - 2',
            'en': 'The Final Coil of Bahamut - Turn 2',
            'fr': 'L\'Abîme de Bahamut II',
            'ja': '大迷宮バハムート：真成編2',
            'ko': '대미궁 바하무트: 진성편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    195: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章3',
            'de': 'Verschlungene Schatten 3 - 3',
            'en': 'The Final Coil of Bahamut - Turn 3',
            'fr': 'L\'Abîme de Bahamut III',
            'ja': '大迷宮バハムート：真成編3',
            'ko': '대미궁 바하무트: 진성편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    196: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章4',
            'de': 'Verschlungene Schatten 3 - 4',
            'en': 'The Final Coil of Bahamut - Turn 4',
            'fr': 'L\'Abîme de Bahamut IV',
            'ja': '大迷宮バハムート：真成編4',
            'ko': '대미궁 바하무트: 진성편 4',
        },
        'offsetX': -448,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 44,
    },
    202: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '伊弗利特讨伐战',
            'de': 'Das Grab der Lohe',
            'en': 'The Bowl of Embers',
            'fr': 'Le Cratère des tisons',
            'ja': 'イフリート討伐戦',
            'ko': '이프리트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 25,
    },
    206: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '泰坦讨伐战',
            'de': 'Der Nabel',
            'en': 'The Navel',
            'fr': 'Le Nombril',
            'ja': 'タイタン討伐戦',
            'ko': '타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    207: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '莫古力贤王歼灭战',
            'de': 'Königliche Konfrontation (schwer)',
            'en': 'Thornmarch (Hard)',
            'fr': 'La Lisière de ronces (brutal)',
            'ja': '善王モグル・モグXII世討滅戦',
            'ko': '선왕 모그루 모그 XII세 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 30,
    },
    208: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '迦楼罗讨伐战',
            'de': 'Das Tosende Auge',
            'en': 'The Howling Eye',
            'fr': 'Hurlœil',
            'ja': 'ガルーダ討伐戦',
            'ko': '가루다 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    214: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '完成集团战训练！',
            'de': 'Einer für alle, alle für einen',
            'en': 'Basic Training: Enemy Parties',
            'fr': 'Entraînement<Indent/>: groupes d\'ennemis',
            'ja': '集団戦訓練をくぐり抜けろ！',
            'ko': '집단전 훈련을 완수하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 16,
    },
    215: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '突破所有关门，讨伐最深处的敌人！',
            'de': 'Sturmkommando',
            'en': 'Basic Training: Enemy Strongholds',
            'fr': 'Entraînement<Indent/>: in<SoftHyphen/>fil<SoftHyphen/>tra<SoftHyphen/>tion en base ennemie',
            'ja': '全関門を突破し、最深部の敵を討て！',
            'ko': '관문을 돌파하고 최심부의 적을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 9,
    },
    216: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '捕获金币龟！',
            'de': 'Gil oder Leben',
            'en': 'Hero on the Half Shell',
            'fr': 'Reconquête d\'une carapace escamotée',
            'ja': 'ギルガメを捕獲せよ！',
            'ko': '길거북을 사로잡아라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 10,
    },
    217: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '帝国南方堡外围激战',
            'de': 'Castrum Meridianum - Außenbereich',
            'en': 'Castrum Meridianum',
            'fr': 'Castrum Meridianum',
            'ja': '外郭攻略 カストルム・メリディアヌム',
            'ko': '카스트룸 메리디아눔',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    219: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '击溃哥布林炸弹军团！',
            'de': 'Bombige Goblins',
            'en': 'Flicking Sticks and Taking Names',
            'fr': 'Les Gobelins bombardiers',
            'ja': '爆弾魔ゴブリン軍団を撃滅せよ！',
            'ko': '폭탄광 고블린 군단을 섬멸하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 3,
    },
    220: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐梦幻之布拉奇希奥！',
            'de': 'Briaxio ausschalten',
            'en': 'All\'s Well that Ends in the Well',
            'fr': 'Briaxio à bras raccourcis',
            'ja': '夢幻のブラキシオを討て！',
            'ko': '몽환의 브라크시오를 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 5,
    },
    221: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐污染源头魔界花！',
            'de': 'Tödliches Rankenspiel',
            'en': 'More than a Feeler',
            'fr': 'Sus au morbol pollueur',
            'ja': '汚染源モルボルを討て！',
            'ko': '오염원 몰볼을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 20,
    },
    222: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐坑道中出现的妖异！',
            'de': 'Gefahr aus dem Nichts',
            'en': 'Annoy the Void',
            'fr': 'Buso l\'immolateur',
            'ja': '坑道に現れた妖異ブソを討て！',
            'ko': '갱도에 나타난 요마 부소를 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 17,
    },
    223: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '注意无敌的眷属，讨伐大型妖异！',
            'de': 'Kampf gegen Schatten',
            'en': 'Shadow and Claw',
            'fr': 'Ombres et griffes',
            'ja': '無敵の眷属を従えし、大型妖異を討て！',
            'ko': '무적의 부하를 조종하는 요마를 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    224: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '天幕魔导城最终决战',
            'de': 'Castrum Meridianum - Praetorium',
            'en': 'The Praetorium',
            'fr': 'Le Praetorium',
            'ja': '最終決戦 魔導城プラエトリウム',
            'ko': '마도성 프라이토리움',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    241: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章1',
            'de': 'Verschlungene Schatten 1',
            'en': 'The Binding Coil of Bahamut - Turn 1',
            'fr': 'Le Labyrinthe de Bahamut I',
            'ja': '大迷宮バハムート：邂逅編1',
            'ko': '대미궁 바하무트: 해후편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    242: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章2',
            'de': 'Verschlungene Schatten 2',
            'en': 'The Binding Coil of Bahamut - Turn 2',
            'fr': 'Le Labyrinthe de Bahamut II',
            'ja': '大迷宮バハムート：邂逅編2',
            'ko': '대미궁 바하무트: 해후편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    243: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章3',
            'de': 'Verschlungene Schatten 3',
            'en': 'The Binding Coil of Bahamut - Turn 3',
            'fr': 'Le Labyrinthe de Bahamut III',
            'ja': '大迷宮バハムート：邂逅編3',
            'ko': '대미궁 바하무트: 해후편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    244: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章4',
            'de': 'Verschlungene Schatten 4',
            'en': 'The Binding Coil of Bahamut - Turn 4',
            'fr': 'Le Labyrinthe de Bahamut IV',
            'ja': '大迷宮バハムート：邂逅編4',
            'ko': '대미궁 바하무트: 해후편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    245: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章5',
            'de': 'Verschlungene Schatten 5',
            'en': 'The Binding Coil of Bahamut - Turn 5',
            'fr': 'Le Labyrinthe de Bahamut V',
            'ja': '大迷宮バハムート：邂逅編5',
            'ko': '대미궁 바하무트: 해후편 5',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    250: {
        'exVersion': 0,
        'name': {
            'cn': '狼狱停船场',
            'de': 'Wolfshöhlen-Pier',
            'en': 'Wolves\' Den Pier',
            'fr': 'Jetée de l\'Antre des loups',
            'ja': 'ウルヴズジェイル係船場',
            'ko': '늑대우리 부두',
        },
        'offsetX': -77,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 29,
    },
    281: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '利维亚桑歼灭战',
            'de': 'Götterdämmerung - Leviathan',
            'en': 'The <Emphasis>Whorleater</Emphasis> (Hard)',
            'fr': 'Le Briseur de marées (brutal)',
            'ja': '真リヴァイアサン討滅戦',
            'ko': '진 리바이어선 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    292: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '伊弗利特歼灭战',
            'de': 'Götterdämmerung - Ifrit',
            'en': 'The Bowl of Embers (Hard)',
            'fr': 'Le Cratère des tisons (brutal)',
            'ja': '真イフリート討滅戦',
            'ko': '진 이프리트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 25,
    },
    293: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '泰坦歼灭战',
            'de': 'Götterdämmerung - Titan',
            'en': 'The Navel (Hard)',
            'fr': 'Le Nombril (brutal)',
            'ja': '真タイタン討滅戦',
            'ko': '진 타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    294: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '迦楼罗歼灭战',
            'de': 'Götterdämmerung - Garuda',
            'en': 'The Howling Eye (Hard)',
            'fr': 'Hurlœil (brutal)',
            'ja': '真ガルーダ討滅戦',
            'ko': '진 가루다 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    295: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '伊弗利特歼殛战',
            'de': 'Zenit der Götter - Ifrit',
            'en': 'The Bowl of Embers (Extreme)',
            'fr': 'Le Cratère des tisons (extrême)',
            'ja': '極イフリート討滅戦',
            'ko': '극 이프리트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 25,
    },
    296: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '泰坦歼殛战',
            'de': 'Zenit der Götter - Titan',
            'en': 'The Navel (Extreme)',
            'fr': 'Le Nombril (extrême)',
            'ja': '極タイタン討滅戦',
            'ko': '극 타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    297: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '迦楼罗歼殛战',
            'de': 'Zenit der Götter - Garuda',
            'en': 'The Howling Eye (Extreme)',
            'fr': 'Hurlœil (extrême)',
            'ja': '極ガルーダ討滅戦',
            'ko': '극 가루다 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    298: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐爆弹怪的女王！',
            'de': 'Miss Bombastic',
            'en': 'Long Live the Queen',
            'fr': 'Longue vie à la Reine',
            'ja': 'ボムを率いる「ボムクイーン」を討て！',
            'ko': '봄을 거느린 \'봄 여왕\'을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    299: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '歼灭特殊阵型的妖异！',
            'de': 'Unzertrennlich',
            'en': 'Ward Up',
            'fr': 'Quintettes infernaux',
            'ja': '不気味な陣形を組む妖異をせん滅せよ！',
            'ko': '불길한 진형을 짜는 요마를 섬멸하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 22,
    },
    300: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '制止三方混战的巨人族，守住遗物！',
            'de': 'Wuchtige Dreifaltigkeit',
            'en': 'Solemn Trinity',
            'fr': 'Trinité sinistre',
            'ja': '三つ巴の巨人族を制し、遺物を守れ！',
            'ko': '세 거인족을 제압하여 유물을 지켜내라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 22,
    },
    332: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '里塔提恩强攻战',
            'de': 'Kap Westwind',
            'en': 'Cape Westwind',
            'fr': 'Le Cap Vendouest',
            'ja': 'リットアティン強襲戦',
            'ko': '리트아틴 강습전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 9,
    },
    348: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '究极神兵破坏作战',
            'de': 'Heldenlied von Ultima',
            'en': 'The Minstrel\'s Ballad: Ultima\'s Bane',
            'fr': 'Le fléau d\'Ultima',
            'ja': '究極幻想 アルテマウェポン破壊作戦',
            'ko': '알테마 웨폰 파괴작전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 31,
    },
    349: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '骚乱坑道铜铃铜山',
            'de': 'Kupferglocken-Mine (schwer)',
            'en': 'Copperbell Mines (Hard)',
            'fr': 'Les Mines de Clochecuivre (brutal)',
            'ja': '騒乱坑道 カッパーベル銅山 (Hard)',
            'ko': '구리종 광산(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    350: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '恶灵府邸静语庄园',
            'de': 'Haukke-Herrenhaus (schwer)',
            'en': 'Haukke Manor (Hard)',
            'fr': 'Le Manoir des Haukke (brutal)',
            'ja': '妖異屋敷 ハウケタ御用邸 (Hard)',
            'ko': '하우케타 별궁(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    353: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '活动挑战2',
            'de': 'Event-Inhalt 1',
            'en': 'Special Event I',
            'fr': 'Défi spécial I',
            'ja': 'イベント用コンテンツ：1',
            'ko': '이벤트용 임무: 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    354: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '活动挑战3',
            'de': 'Event-Inhalt 2',
            'en': 'Special Event II',
            'fr': 'Défi spécial II',
            'ja': 'イベント用コンテンツ：2',
            'ko': '이벤트용 임무: 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 103,
    },
    355: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章1',
            'de': 'Verschlungene Schatten 2 - 1',
            'en': 'The Second Coil of Bahamut - Turn 1',
            'fr': 'Les Méandres de Bahamut I',
            'ja': '大迷宮バハムート：侵攻編1',
            'ko': '대미궁 바하무트: 침공편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    356: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章2',
            'de': 'Verschlungene Schatten 2 - 2',
            'en': 'The Second Coil of Bahamut - Turn 2',
            'fr': 'Les Méandres de Bahamut II',
            'ja': '大迷宮バハムート：侵攻編2',
            'ko': '대미궁 바하무트: 침공편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    357: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章3',
            'de': 'Verschlungene Schatten 2 - 3',
            'en': 'The Second Coil of Bahamut - Turn 3',
            'fr': 'Les Méandres de Bahamut III',
            'ja': '大迷宮バハムート：侵攻編3',
            'ko': '대미궁 바하무트: 침공편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    358: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章4',
            'de': 'Verschlungene Schatten 2 - 4',
            'en': 'The Second Coil of Bahamut - Turn 4',
            'fr': 'Les Méandres de Bahamut IV',
            'ja': '大迷宮バハムート：侵攻編4',
            'ko': '대미궁 바하무트: 침공편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    359: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '利维亚桑歼殛战',
            'de': 'Zenit der Götter - Leviathan',
            'en': 'The <Emphasis>Whorleater</Emphasis> (Extreme)',
            'fr': 'Le Briseur de marées (extrême)',
            'ja': '極リヴァイアサン討滅戦',
            'ko': '극 리바이어선 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    360: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '剑斗领域日影地修炼所',
            'de': 'Halatali (schwer)',
            'en': 'Halatali (Hard)',
            'fr': 'Halatali (brutal)',
            'ja': '剣闘領域 ハラタリ修練所 (Hard)',
            'ko': '할라탈리 수련장(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    361: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '财宝传说破舰岛',
            'de': 'Schiffbrecher-Insel',
            'en': 'Hullbreaker Isle',
            'fr': 'L\'Île de Crèvecarène',
            'ja': '財宝伝説 ハルブレーカー・アイル',
            'ko': '난파선의 섬',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    362: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '纷争要地布雷福洛克斯野营地',
            'de': 'Brüllvolx\' Langrast (schwer)',
            'en': 'Brayflox\'s Longstop (Hard)',
            'fr': 'Le Bivouac de Brayflox (brutal)',
            'ja': '盟友支援 ブレイフロクスの野営地 (Hard)',
            'ko': '브레이플록스의 야영지(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 37,
    },
    363: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '腐坏遗迹无限城市街古迹',
            'de': 'Historisches Amdapor',
            'en': 'The Lost City of Amdapor',
            'fr': 'Les Vestiges de la cité d\'Amdapor',
            'ja': '腐敗遺跡 古アムダプール市街',
            'ko': '옛 암다포르 시가지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    364: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '莫古力贤王歼殛战',
            'de': 'Königliche Konfrontation (extrem)',
            'en': 'Thornmarch (Extreme)',
            'fr': 'La Lisière de ronces (extrême)',
            'ja': '極王モグル・モグXII世討滅戦',
            'ko': '극왕 모그루 모그 XII세 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 30,
    },
    365: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '激战城塞石卫塔',
            'de': 'Steinerne Wacht (schwer)',
            'en': 'The Stone Vigil (Hard)',
            'fr': 'Le Vigile de Pierre (brutal)',
            'ja': '城塞奪回 ストーンヴィジル (Hard)',
            'ko': '돌방패 경계초소(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 42,
    },
    366: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '大桥上的决斗',
            'de': 'Duell auf der großen Brücke',
            'en': 'Battle on the Big Bridge',
            'fr': 'Affrontement sur le grand pont',
            'ja': 'ギルガメッシュ討伐戦',
            'ko': '길가메시 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    367: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '苏醒遗迹喀恩埋没圣堂',
            'de': 'Versunkener Tempel von Qarn (schwer)',
            'en': 'The Sunken Temple of Qarn (Hard)',
            'fr': 'Le Temple enseveli de Qarn (brutal)',
            'ja': '遺跡救援 カルン埋没寺院 (Hard)',
            'ko': '카른의 무너진 사원(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 41,
    },
    368: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '死化奇美拉讨伐战',
            'de': 'Kampf gegen die Dhorme-Chimära',
            'en': 'A Relic Reborn: the Chimera',
            'fr': 'La chimère dhorme du Coerthas',
            'ja': 'ドルムキマイラ討伐戦',
            'ko': '도름 키마이라 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    369: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '海德拉讨伐战',
            'de': 'Kampf gegen die Hydra',
            'en': 'A Relic Reborn: the Hydra',
            'fr': 'L\'hydre d\'Halatali',
            'ja': 'ハイドラ討伐戦',
            'ko': '하이드라 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    371: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '凛冽洞天披雪大冰壁',
            'de': 'Das Schneekleid',
            'en': 'Snowcloak',
            'fr': 'Manteneige',
            'ja': '氷結潜窟 スノークローク大氷壁',
            'ko': '얼음외투 대빙벽',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 42,
    },
    372: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '水晶塔 希尔科斯塔',
            'de': 'Kristallturm - Der Syrcus-Turm',
            'en': 'Syrcus Tower',
            'fr': 'La Tour de Cristal - Tour de Syrcus',
            'ja': 'クリスタルタワー：シルクスの塔',
            'ko': '크리스탈 타워: 시르쿠스 탑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    373: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '惨剧灵殿塔姆·塔拉墓园',
            'de': 'Totenacker Tam-Tara (schwer)',
            'en': 'The Tam–Tara Deepcroft (Hard)',
            'fr': 'L\'Hypogée de Tam-Tara (brutal)',
            'ja': '惨劇霊殿 タムタラの墓所 (Hard)',
            'ko': '탐타라 묘소(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 300,
        'weatherRate': 0,
    },
    374: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '拉姆歼灭战',
            'de': 'Götterdämmerung - Ramuh',
            'en': 'The Striking Tree (Hard)',
            'fr': 'L\'Arbre du jugement (brutal)',
            'ja': '真ラムウ討滅戦',
            'ko': '진 라무 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 43,
    },
    375: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '拉姆歼殛战',
            'de': 'Zenit der Götter - Ramuh',
            'en': 'The Striking Tree (Extreme)',
            'fr': 'L\'Arbre du jugement (extrême)',
            'ja': '極ラムウ討滅戦',
            'ko': '극 라무 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 43,
    },
    376: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '周边遗迹群 (阵地战)',
            'de': 'Äußere Ruinen (Sicherung)',
            'en': 'The Borderland Ruins (Secure)',
            'fr': 'Les Ruines frontalières (annexion)',
            'ja': '外縁遺跡群 (制圧戦)',
            'ko': '외곽 유적지대(제압전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    377: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '希瓦歼灭战',
            'de': 'Götterdämmerung - Shiva',
            'en': 'The Akh Afah Amphitheatre (Hard)',
            'fr': 'L\'Amphithéâtre d\'Akh Afah (brutal)',
            'ja': '真シヴァ討滅戦',
            'ko': '진 시바 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    378: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '希瓦歼殛战',
            'de': 'Zenit der Götter - Shiva',
            'en': 'The Akh Afah Amphitheatre (Extreme)',
            'fr': 'L\'Amphithéâtre d\'Akh Afah (extrême)',
            'ja': '極シヴァ討滅戦',
            'ko': '극 시바 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    380: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章1',
            'de': 'Verschlungene Schatten 2 - 1 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 1',
            'fr': 'Les Méandres de Bahamut I (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編1',
            'ko': '대미궁 바하무트: 침공편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    381: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章2',
            'de': 'Verschlungene Schatten 2 - 2 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 2',
            'fr': 'Les Méandres de Bahamut II (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編2',
            'ko': '대미궁 바하무트: 침공편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    382: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章3',
            'de': 'Verschlungene Schatten 2 - 3 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 3',
            'fr': 'Les Méandres de Bahamut III (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編3',
            'ko': '대미궁 바하무트: 침공편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    383: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章4',
            'de': 'Verschlungene Schatten 2 - 4 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 4',
            'fr': 'Les Méandres de Bahamut IV (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編4',
            'ko': '대미궁 바하무트: 침공편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    387: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '逆转要害沙斯塔夏溶洞',
            'de': 'Sastasha (schwer)',
            'en': 'Sastasha (Hard)',
            'fr': 'Sastasha (brutal)',
            'ja': '逆襲要害 サスタシャ浸食洞 (Hard)',
            'ko': '사스타샤 침식 동굴(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    389: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：太阳海岸',
            'de': 'Chocobo-Rennen: Sonnenküste',
            'en': 'Chocobo Race: Costa del Sol',
            'fr': 'Course de chocobos<Indent/>: Costa del Sol',
            'ja': 'チョコボレース：コスタ・デル・ソル',
            'ko': '초코보 경주: 코스타 델 솔',
        },
        'offsetX': -472,
        'offsetY': -424,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    390: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：荒野大道',
            'de': 'Chocobo-Rennen: Sagolii-Straße',
            'en': 'Chocobo Race: Sagolii Road',
            'fr': 'Course de chocobos<Indent/>: Route de Sagolii',
            'ja': 'チョコボレース：サゴリーロード',
            'ko': '초코보 경주: 사골리 사막',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    391: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：恬静小路',
            'de': 'Chocobo-Rennen: Pfad der Seelenruhe',
            'en': 'Chocobo Race: Tranquil Paths',
            'fr': 'Course de chocobos<Indent/>: Sentes tranquilles',
            'ja': 'チョコボレース：トランキルパス',
            'ko': '초코보 경주: 고요한 야영지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    394: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '奥丁歼灭战',
            'de': 'Jenseits Urths Quelle',
            'en': 'Urth\'s Fount',
            'fr': 'La Fontaine d\'Urth',
            'ja': '闘神オーディン討滅戦',
            'ko': '투신 오딘 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 45,
    },
    396: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '无限城的死斗',
            'de': 'Revanche in den Ruinen',
            'en': 'Battle in the Big Keep',
            'fr': 'Revanche au vieux château',
            'ja': '真ギルガメッシュ討滅戦',
            'ko': '진 길가메시 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    397: {
        'exVersion': 1,
        'name': {
            'cn': '库尔札斯西部高地',
            'de': 'Westliches Hochland von Coerthas',
            'en': 'Coerthas Western Highlands',
            'fr': 'Hautes terres du Coerthas occidental',
            'ja': 'クルザス西部高地',
            'ko': '커르다스 서부고지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 49,
    },
    398: {
        'exVersion': 1,
        'name': {
            'cn': '龙堡参天高地',
            'de': 'Dravanisches Vorland',
            'en': 'The Dravanian Forelands',
            'fr': 'Avant-pays dravanien',
            'ja': '高地ドラヴァニア',
            'ko': '고지 드라바니아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 50,
    },
    399: {
        'exVersion': 1,
        'name': {
            'cn': '龙堡内陆低地',
            'de': 'Dravanisches Hinterland',
            'en': 'The Dravanian Hinterlands',
            'fr': 'Arrière-pays dravanien',
            'ja': '低地ドラヴァニア',
            'ko': '저지 드라바니아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 51,
    },
    400: {
        'exVersion': 1,
        'name': {
            'cn': '翻云雾海',
            'de': 'Wallende Nebel',
            'en': 'The Churning Mists',
            'fr': 'L\'Écume des cieux de Dravania',
            'ja': 'ドラヴァニア雲海',
            'ko': '드라바니아 구름바다',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 52,
    },
    401: {
        'exVersion': 1,
        'name': {
            'cn': '阿巴拉提亚云海',
            'de': 'Abalathisches Wolkenmeer',
            'en': 'The Sea of Clouds',
            'fr': 'L\'Écume des cieux d\'Abalathia',
            'ja': 'アバラシア雲海',
            'ko': '아발라시아 구름바다',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 53,
    },
    402: {
        'exVersion': 1,
        'name': {
            'cn': '魔大陆阿济兹拉',
            'de': 'Azys Lla',
            'en': 'Azys Lla',
            'fr': 'Azys Lla',
            'ja': 'アジス・ラー',
            'ko': '아지스 라',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 54,
    },
    403: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '英雄归来',
            'de': 'Verrat der Qalyana',
            'en': 'Return of the Bull',
            'fr': 'Retour au bercail',
            'ja': '英雄の帰還',
            'ko': '영웅의 귀환',
        },
        'offsetX': -250,
        'offsetY': 128,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    416: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '学识宝库迦巴勒幻想图书馆',
            'de': 'Große Gubal-Bibliothek',
            'en': 'The Great Gubal Library',
            'fr': 'La Grande bibliothèque de Gubal',
            'ja': '禁書回収 グブラ幻想図書館',
            'ko': '구브라 환상도서관',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    417: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：竞赛教学',
            'de': 'Chocobo-Rennen: Übungsbahn',
            'en': 'Chocobo Race: Tutorial',
            'fr': 'Course d\'appentissage',
            'ja': 'チョコボレース：チュートリアル',
            'ko': '초코보 경주: 튜토리얼',
        },
        'offsetX': 0,
        'offsetY': -690,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    418: {
        'exVersion': 1,
        'name': {
            'cn': '伊修加德基础层',
            'de': 'Fundamente',
            'en': 'Foundation',
            'fr': 'Ishgard - L\'Assise',
            'ja': 'イシュガルド：下層',
            'ko': '이슈가르드 하층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 47,
    },
    419: {
        'exVersion': 1,
        'name': {
            'cn': '伊修加德砥柱层',
            'de': 'Strebewerk',
            'en': 'The Pillars',
            'fr': 'Ishgard - Les Contreforts',
            'ja': 'イシュガルド：上層',
            'ko': '이슈가르드 상층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 48,
    },
    420: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '空中神域不获岛',
            'de': 'Nimmerreich',
            'en': 'Neverreap',
            'fr': 'Nalloncques',
            'ja': '神域浮島 ネバーリープ',
            'ko': '거두지 않는 섬',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    421: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '圣教中枢伊修加德教皇厅',
            'de': 'Erzbasilika',
            'en': 'The Vault',
            'fr': 'La Voûte',
            'ja': '強硬突入 イシュガルド教皇庁',
            'ko': '이슈가르드 교황청',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    426: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '那布里亚勒斯讨伐战',
            'de': 'Chrysalis',
            'en': 'The Chrysalis',
            'fr': 'La Chrysalide',
            'ja': 'アシエン・ナプリアレス討伐戦',
            'ko': '아씨엔 나브리알레스 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    430: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '博物战舰无限回廊',
            'de': 'Die Fraktal-Kontinuum',
            'en': 'The Fractal Continuum',
            'fr': 'Le Continuum fractal',
            'ja': '博物戦艦 フラクタル・コンティニアム',
            'ko': '무한연속 박물함',
        },
        'offsetX': 0,
        'offsetY': -213,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    431: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '尘封秘岩 (争夺战)',
            'de': 'Robbenholm (Eroberung)',
            'en': 'Seal Rock (Seize)',
            'fr': 'Le Rocher des tréfonds (invasion)',
            'ja': 'シールロック (争奪戦)',
            'ko': '봉인된 바위섬(쟁탈전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 59,
    },
    432: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '罗波那歼灭战',
            'de': 'Götterdämmerung - Ravana',
            'en': 'Thok ast Thok (Hard)',
            'fr': 'Thok ast Thok (brutal)',
            'ja': '真ラーヴァナ討滅戦',
            'ko': '진 라바나 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 57,
    },
    434: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '冰雪废堡暮卫塔',
            'de': 'Abendrot-Wacht',
            'en': 'The Dusk Vigil',
            'fr': 'Le Vigile du Crépuscule',
            'ja': '廃砦捜索 ダスクヴィジル',
            'ko': '어스름 요새',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 42,
    },
    435: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '邪龙王座龙巢神殿',
            'de': 'Nest des Drachen',
            'en': 'The Aery',
            'fr': 'L\'Aire',
            'ja': '邪竜血戦 ドラゴンズエアリー',
            'ko': '용의 둥지',
        },
        'offsetX': -40,
        'offsetY': 55,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    436: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '俾斯麦歼灭战',
            'de': 'Götterdämmerung - Bismarck',
            'en': 'The Limitless Blue (Hard)',
            'fr': 'L\'Immensité bleue (brutal)',
            'ja': '真ビスマルク討滅戦',
            'ko': '진 비스마르크 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    437: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '圆桌骑士歼灭战',
            'de': 'Singularitäts-Reaktor',
            'en': 'The Singularity Reactor',
            'fr': 'Le Réacteur de singularité',
            'ja': 'ナイツ・オブ・ラウンド討滅戦',
            'ko': '나이츠 오브 라운드 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 56,
    },
    438: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '血战苍穹魔科学研究所',
            'de': 'Ätherochemisches For<SoftHyphen/>schungs<SoftHyphen/>labor',
            'en': 'The Aetherochemical Research Facility',
            'fr': 'Le Laboratoire de magismologie',
            'ja': '蒼天聖戦 魔科学研究所',
            'ko': '마과학 연구소',
        },
        'offsetX': -18,
        'offsetY': 149,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    441: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '天山绝顶索姆阿尔灵峰',
            'de': 'Sohm Al',
            'en': 'Sohm Al',
            'fr': 'Sohm Al',
            'ja': '霊峰踏破 ソーム・アル',
            'ko': '솜 알',
        },
        'offsetX': 185,
        'offsetY': 51,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    442: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章1',
            'de': 'Alexander - Faust des Vaters',
            'en': 'Alexander - The Fist of the Father',
            'fr': 'Alexander - Le Poing du Père',
            'ja': '機工城アレキサンダー：起動編1',
            'ko': '기공성 알렉산더: 기동편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    443: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章2',
            'de': 'Alexander - Elle des Vaters',
            'en': 'Alexander - The Cuff of the Father',
            'fr': 'Alexander - Le Poignet du Père',
            'ja': '機工城アレキサンダー：起動編2',
            'ko': '기공성 알렉산더: 기동편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    444: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章3',
            'de': 'Alexander - Arm des Vaters',
            'en': 'Alexander - The Arm of the Father',
            'fr': 'Alexander - Le Bras du Père',
            'ja': '機工城アレキサンダー：起動編3',
            'ko': '기공성 알렉산더: 기동편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    445: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章4',
            'de': 'Alexander - Last des Vaters',
            'en': 'Alexander - The Burden of the Father',
            'fr': 'Alexander - Le Fardeau du Père',
            'ja': '機工城アレキサンダー：起動編4',
            'ko': '기공성 알렉산더: 기동편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    446: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '罗波那歼殛战',
            'de': 'Zenit der Götter - Ravana',
            'en': 'Thok ast Thok (Extreme)',
            'fr': 'Thok ast Thok (extrême)',
            'ja': '極ラーヴァナ討滅戦',
            'ko': '극 라바나 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 57,
    },
    447: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '俾斯麦歼殛战',
            'de': 'Zenit der Götter - Bismarck',
            'en': 'The Limitless Blue (Extreme)',
            'fr': 'L\'Immensité bleue (extrême)',
            'ja': '極ビスマルク討滅戦',
            'ko': '극 비스마르크 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    448: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '圆桌骑士幻想歼灭战',
            'de': 'Heldenlied von Thordans Fall',
            'en': 'The Minstrel\'s Ballad: Thordan\'s Reign',
            'fr': 'Le règne de Thordan',
            'ja': '蒼天幻想 ナイツ・オブ・ラウンド討滅戦',
            'ko': '극 나이츠 오브 라운드 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 56,
    },
    449: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章1',
            'de': 'Alexander - Faust des Vaters (episch)',
            'en': 'Alexander - The Fist of the Father (Savage)',
            'fr': 'Alexander - Le Poing du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編1',
            'ko': '기공성 알렉산더: 기동편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    450: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章2',
            'de': 'Alexander - Elle des Vaters (episch)',
            'en': 'Alexander - The Cuff of the Father (Savage)',
            'fr': 'Alexander - Le Poignet du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編2',
            'ko': '기공성 알렉산더: 기동편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    451: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章3',
            'de': 'Alexander - Arm des Vaters (episch)',
            'en': 'Alexander - The Arm of the Father (Savage)',
            'fr': 'Alexander - Le Bras du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編3',
            'ko': '기공성 알렉산더: 기동편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    452: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章4',
            'de': 'Alexander - Last des Vaters (episch)',
            'en': 'Alexander - The Burden of the Father (Savage)',
            'fr': 'Alexander - Le Fardeau du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編4',
            'ko': '기공성 알렉산더: 기동편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    478: {
        'exVersion': 1,
        'name': {
            'cn': '田园郡',
            'de': 'Frohehalde',
            'en': 'Idyllshire',
            'fr': 'Idyllée',
            'ja': 'イディルシャイア',
            'ko': '이딜샤이어',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 55,
    },
    506: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：大赛对战（人机对战）',
            'de': 'Kampf der Trabanten: Turnier (gegen Arenameister)',
            'en': 'LoVM: Master Tournament',
            'fr': 'Bataille de tournoi contre l\'ordinateur',
            'ja': 'LoVM：大会対戦 (CPU対戦)',
            'ko': '꼬마 친구 공방전: 대회 대결(인공 지능 대결)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    508: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '魔航船虚无方舟',
            'de': 'Die Nichts-Arche',
            'en': 'The Void Ark',
            'fr': 'L\'Arche du néant',
            'ja': '魔航船ヴォイドアーク',
            'ko': '보이드의 방주',
        },
        'offsetX': 289,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 37,
    },
    509: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '活动挑战1',
            'de': 'Event-Inhalt 3',
            'en': 'Special Event III',
            'fr': 'Défi spécial III',
            'ja': 'イベント用コンテンツ：3',
            'ko': '이벤트용 임무: 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    510: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '地脉灵灯天狼星灯塔',
            'de': 'Pharos Sirius (schwer)',
            'en': 'Pharos Sirius (Hard)',
            'fr': 'Le Phare de Sirius (brutal)',
            'ja': '制圧巨塔 シリウス大灯台 (Hard)',
            'ko': '시리우스 대등대(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    511: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '草木庭园圣茉夏娜植物园',
            'de': 'Sankt Mocianne-Arboretum',
            'en': 'Saint Mocianne\'s Arboretum',
            'fr': 'L\'Arboretum Sainte-Mocianne',
            'ja': '草木庭園 聖モシャーヌ植物園',
            'ko': '성 모샨 식물원',
        },
        'offsetX': 40,
        'offsetY': 6,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    512: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛白昼探索',
            'de': 'Das Diadem (leicht)',
            'en': 'The Diadem (Easy)',
            'fr': 'Le Diadème (facile)',
            'ja': '雲海探索 ディアデム諸島 (Easy)',
            'ko': '디아뎀 제도(쉬움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 60,
    },
    515: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛夜晚探索',
            'de': 'Das Diadem (schwer)',
            'en': 'The Diadem (Hard)',
            'fr': 'Le Diadème (brutal)',
            'ja': '雲海探索 ディアデム諸島 (Hard)',
            'ko': '디아뎀 제도(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 62,
    },
    516: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '星海空间颠倒塔',
            'de': 'Antiturm',
            'en': 'The Antitower',
            'fr': 'L\'Antitour',
            'ja': '星海観測 逆さの塔 ',
            'ko': '거꾸로 선 탑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    517: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '萨菲洛特歼灭战',
            'de': 'Götterdämmerung - Sephirot',
            'en': 'Containment Bay S1T7',
            'fr': 'Unité de contention S1P7',
            'ja': '魔神セフィロト討滅戦',
            'ko': '마신 세피로트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 66,
    },
    519: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '神圣遗迹无限城市街古迹',
            'de': 'Historisches Amdapor (schwer)',
            'en': 'The Lost City of Amdapor (Hard)',
            'fr': 'Les Vestiges de la cité d\'Amdapor (brutal)',
            'ja': '神聖遺跡 古アムダプール市街 (Hard)',
            'ko': '옛 암다포르 시가지(어려움)',
        },
        'offsetX': 64,
        'offsetY': 315,
        'sizeFactor': 200,
        'weatherRate': 63,
    },
    520: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章1',
            'de': 'Alexander - Faust des Sohnes',
            'en': 'Alexander - The Fist of the Son',
            'fr': 'Alexander - Le Poing du Fils',
            'ja': '機工城アレキサンダー：律動編1',
            'ko': '기공성 알렉산더: 율동편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    521: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章2',
            'de': 'Alexander - Elle des Sohnes',
            'en': 'Alexander - The Cuff of the Son',
            'fr': 'Alexander - Le Poignet du Fils',
            'ja': '機工城アレキサンダー：律動編2',
            'ko': '기공성 알렉산더: 율동편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    522: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章3',
            'de': 'Alexander - Arm des Sohnes',
            'en': 'Alexander - The Arm of the Son',
            'fr': 'Alexander - Le Bras du Fils',
            'ja': '機工城アレキサンダー：律動編3',
            'ko': '기공성 알렉산더: 율동편 3',
        },
        'offsetX': -110,
        'offsetY': -170,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    523: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章4',
            'de': 'Alexander - Last des Sohnes',
            'en': 'Alexander - The Burden of the Son',
            'fr': 'Alexander - Le Fardeau du Fils',
            'ja': '機工城アレキサンダー：律動編4',
            'ko': '기공성 알렉산더: 율동편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    524: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '萨菲洛特歼殛战',
            'de': 'Zenit der Götter - Sephirot',
            'en': 'Containment Bay S1T7 (Extreme)',
            'fr': 'Unité de contention S1P7 (extrême)',
            'ja': '極魔神セフィロト討滅戦',
            'ko': '극 마신 세피로트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 66,
    },
    525: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (4对4 / 练习赛)',
            'de': 'The Feast (4 gegen 4, Übungskampf)',
            'en': 'The Feast (4 on 4 - Training)',
            'fr': 'The Feast (4x4/en<SoftHyphen/>traî<SoftHyphen/>ne<SoftHyphen/>ment)',
            'ja': 'ザ・フィースト (4対4 / カジュアルマッチ)',
            'ko': '더 피스트 (4 대 4 / 일반전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 65,
    },
    527: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (4对4 / 段位赛)',
            'de': 'The Feast (4 gegen 4, gewertet)',
            'en': 'The Feast (4 on 4 - Ranked)',
            'fr': 'The Feast (4x4/classé)',
            'ja': 'ザ・フィースト (4対4 / ランクマッチ)',
            'ko': '더 피스트 (4 대 4 / 등급전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 65,
    },
    529: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章1',
            'de': 'Alexander - Faust des Sohnes (episch)',
            'en': 'Alexander - The Fist of the Son (Savage)',
            'fr': 'Alexander - Le Poing du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編1',
            'ko': '기공성 알렉산더: 율동편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    530: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章2',
            'de': 'Alexander - Elle des Sohnes (episch)',
            'en': 'Alexander - The Cuff of the Son (Savage)',
            'fr': 'Alexander - Le Poignet du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編2',
            'ko': '기공성 알렉산더: 율동편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    531: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章3',
            'de': 'Alexander - Arm des Sohnes (episch)',
            'en': 'Alexander - The Arm of the Son (Savage)',
            'fr': 'Alexander - Le Bras du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編3',
            'ko': '기공성 알렉산더: 율동편(영웅) 3',
        },
        'offsetX': -110,
        'offsetY': -170,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    532: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章4',
            'de': 'Alexander - Last des Sohnes (episch)',
            'en': 'Alexander - The Burden of the Son (Savage)',
            'fr': 'Alexander - Le Fardeau du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編4',
            'ko': '기공성 알렉산더: 율동편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    533: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '四国联合军演',
            'de': 'Truppenübung der Eorzäischen Allianz',
            'en': 'A Spectacle for the Ages',
            'fr': 'La grande manœuvre éorzéenne',
            'ja': '四国合同演習',
            'ko': '4개국 합동 훈련',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    537: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '躲避范围攻击',
            'de': 'Flächenangriffen ausweichen',
            'en': 'Avoid Area of Effect Attacks',
            'fr': 'Éviter les attaques à aire d\'effet',
            'ja': '範囲攻撃を避けよう！',
            'ko': '범위 공격을 피하자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    538: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '掌握仇恨连击',
            'de': 'Mit Kombos Feindseligkeit auf sich ziehen',
            'en': 'Execute a Combo to Increase Enmity',
            'fr': 'Générer de l\'inimitié avec un combo',
            'ja': 'コンボで敵視を集めよう！',
            'ko': '콤보를 이어 적개심을 끌자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    539: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '控制敌人的仇恨',
            'de': 'Kombos im Kampf einsetzen',
            'en': 'Execute a Combo in Battle',
            'fr': 'Effectuer le combo en combat',
            'ja': '実戦でコンボに挑戦しよう！',
            'ko': '실전에서 콤보를 사용해보자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    540: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '控制多个敌人的仇恨',
            'de': 'Feindseligkeit mehrerer Gegner auf sich ziehen',
            'en': 'Accrue Enmity from Multiple Targets',
            'fr': 'Attirer l\'inimitié de plusieurs ennemis sur soi',
            'ja': '複数の敵から敵視を集めよう！',
            'ko': '다수의 적에게서 적개심을 끌자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    541: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '实战控制多个敌人的仇恨',
            'de': 'Gegen mehrere Gegner auf einmal kämpfen',
            'en': 'Engage Multiple Targets',
            'fr': 'Affronter plusieurs ennemis',
            'ja': '実戦で複数の敵と戦ってみよう！',
            'ko': '실전에서 다수의 적과 싸워보자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    542: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '控制远处敌人的仇恨',
            'de': 'Aus der Ferne Feindseligkeit auf sich ziehen',
            'en': 'Execute a Ranged Attack to Increase Enmity',
            'fr': 'Générer de l\'inimitié à distance',
            'ja': '遠距離から敵視を集めよう！',
            'ko': '멀리서 적개심을 끌자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    543: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '留心增援的敌人',
            'de': 'Feindliche Verstärkung aufhalten',
            'en': 'Engage Enemy Reinforcements',
            'fr': 'Faire face à des renforts ennemis',
            'ja': '敵の増援に対応しよう！',
            'ko': '적 지원군에 대처하자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    544: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '配合防护职业打倒单个敌人',
            'de': 'Gegner gemeinsam besiegen',
            'en': 'Assist Allies in Defeating a Target',
            'fr': 'Vaincre un ennemi en assistant des alliés',
            'ja': '味方と協力して敵を倒そう！',
            'ko': '파티원과 협력하여 적을 물리치자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    545: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '配合防护职业打倒多个敌人',
            'de': 'Den Gegner eines Verbündeten besiegen',
            'en': 'Defeat an Occupied Target',
            'fr': 'Vaincre un ennemi occupé par un allié',
            'ja': '味方が引きつけている敵を倒そう！',
            'ko': '파티원과 같은 적을 공격하자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    546: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '躲避范围攻击的同时进行战斗',
            'de': 'Angriffen ausweichen',
            'en': 'Avoid Engaged Targets',
            'fr': 'Combattre en évitant les attaques ennemies',
            'ja': '敵の攻撃を避けながら戦おう！',
            'ko': '적의 공격을 피하면서 싸우자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    548: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '灵活运用场地机关',
            'de': 'Mit dem Gelände interagieren',
            'en': 'Interact with the Battlefield',
            'fr': 'Interagir avec le décor en combat',
            'ja': 'ギミックを活用して戦おう！',
            'ko': '특수 장치를 활용하며 싸우자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    549: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '治疗防护职业',
            'de': 'Verbündete heilen',
            'en': 'Heal an Ally',
            'fr': 'Soigner un allié',
            'ja': '味方を回復しよう！',
            'ko': '파티원을 회복시키자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    550: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '治疗小队队员',
            'de': 'Mehrere Verbündete heilen',
            'en': 'Heal Multiple Allies',
            'fr': 'Soigner plusieurs alliés',
            'ja': '複数の味方を回復しよう！',
            'ko': '다수의 파티원을 회복시키자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    552: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '最终训练',
            'de': 'Letzte Übung',
            'en': 'Final Exercise',
            'fr': 'Exercice final',
            'ja': '最終訓練！',
            'ko': '마지막 훈련!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    554: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '荣誉野 (碎冰战)',
            'de': 'Feld der Ehre (Zersplitterung)',
            'en': 'The Fields of Glory (Shatter)',
            'fr': 'Les Champs de la Gloire (brise-glace)',
            'ja': 'フィールド・オブ・グローリー (砕氷戦)',
            'ko': '영광의 평원(쇄빙전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 67,
    },
    555: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '天龙宫殿忆罪宫',
            'de': 'Sohr Khai',
            'en': 'Sohr Khai',
            'fr': 'Sohr Khai',
            'ja': '天竜宮殿 ソール・カイ',
            'ko': '소르 카이',
        },
        'offsetX': 370,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    556: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '禁忌城邦玛哈',
            'de': 'Die Stadt der Tränen',
            'en': 'The Weeping City of Mhach',
            'fr': 'La Cité défendue de Mhach',
            'ja': '禁忌都市マハ',
            'ko': '금기도시 마하',
        },
        'offsetX': -40,
        'offsetY': -40,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    557: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '黑涡传说破舰岛',
            'de': 'Schiffbrecher-Insel (schwer)',
            'en': 'Hullbreaker Isle (Hard)',
            'fr': 'L\'Île de Crèvecarène (brutal)',
            'ja': '黒渦伝説 ハルブレーカー・アイル (Hard)',
            'ko': '난파선의 섬(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 68,
    },
    558: {
        'contentType': 9,
        'exVersion': 0,
        'name': {
            'cn': '水城宝物库',
            'de': 'Aquapolis',
            'en': 'The Aquapolis',
            'fr': 'L\'Aquapole',
            'ja': '宝物庫 アクアポリス',
            'ko': '보물고 아쿠아폴리스',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    559: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '尼德霍格征龙战',
            'de': 'Der letzte Schicksalsweg',
            'en': 'The Final Steps of Faith',
            'fr': 'La Dernière avancée de la Foi',
            'ja': 'ニーズヘッグ征竜戦',
            'ko': '니드호그 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    560: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '雷古拉·范·休著斯追击战',
            'de': 'Blutiges Wieder<SoftHyphen/>sehen',
            'en': 'A Bloody Reunion',
            'fr': 'Course-poursuite dans le laboratoire',
            'ja': 'レグラ・ヴァン・ヒュドルス追撃戦',
            'ko': '레굴라 반 히드루스 추격전',
        },
        'offsetX': -18,
        'offsetY': 149,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    561: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下1～10层',
            'de': 'Palast der Toten (Ebenen 1-10)',
            'en': 'The Palace of the Dead (Floors 1-10)',
            'fr': 'Le Palais des morts (sous-sols 1-10)',
            'ja': '死者の宮殿 B1～B10',
            'ko': '망자의 궁전 B1~B10',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    562: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下11～20层',
            'de': 'Palast der Toten (Ebenen 11-20)',
            'en': 'The Palace of the Dead (Floors 11-20)',
            'fr': 'Le Palais des morts (sous-sols 11-20)',
            'ja': '死者の宮殿 B11～B20',
            'ko': '망자의 궁전 B11~B20',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    563: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下21～30层',
            'de': 'Palast der Toten (Ebenen 21-30)',
            'en': 'The Palace of the Dead (Floors 21-30)',
            'fr': 'Le Palais des morts (sous-sols 21-30)',
            'ja': '死者の宮殿 B21～B30',
            'ko': '망자의 궁전 B21~B30',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    564: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下31～40层',
            'de': 'Palast der Toten (Ebenen 31-40)',
            'en': 'The Palace of the Dead (Floors 31-40)',
            'fr': 'Le Palais des morts (sous-sols 31-40)',
            'ja': '死者の宮殿 B31～B40',
            'ko': '망자의 궁전 B31~B40',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    565: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下41～50层',
            'de': 'Palast der Toten (Ebenen 41-50)',
            'en': 'The Palace of the Dead (Floors 41-50)',
            'fr': 'Le Palais des morts (sous-sols 41-50)',
            'ja': '死者の宮殿 B41～B50',
            'ko': '망자의 궁전 B41~B50',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    566: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '尼德霍格传奇征龙战',
            'de': 'Das Lied von Nidhoggs letztem Ruf',
            'en': 'The Minstrel\'s Ballad: Nidhogg\'s Rage',
            'fr': 'L\'ire de Nidhogg',
            'ja': '極ニーズヘッグ征竜戦',
            'ko': '극 니드호그 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    571: {
        'contentType': 22,
        'exVersion': 0,
        'name': {
            'cn': '亡灵府邸闹鬼庄园',
            'de': 'Das Geisterschloss',
            'en': 'The Haunted Manor',
            'fr': 'Le Manoir hanté',
            'ja': '亡霊屋敷 ホーンテッドマナー',
            'ko': '유령의 집',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    572: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '险峻峡谷塞尔法特尔溪谷',
            'de': 'Xelphatol',
            'en': 'Xelphatol',
            'fr': 'Xelphatol',
            'ja': '峻厳渓谷 ゼルファトル',
            'ko': '젤파톨',
        },
        'offsetX': -148,
        'offsetY': 35,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    576: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '索菲娅歼灭战',
            'de': 'Götterdämmerung - Sophia',
            'en': 'Containment Bay P1T6',
            'fr': 'Unité de contention P1P6',
            'ja': '女神ソフィア討滅戦',
            'ko': '여신 소피아 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 69,
    },
    577: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '索菲娅歼殛战',
            'de': 'Zenit der Götter - Sophia',
            'en': 'Containment Bay P1T6 (Extreme)',
            'fr': 'Unité de contention P1P6 (extrême)',
            'ja': '極女神ソフィア討滅戦',
            'ko': '극 여신 소피아 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 69,
    },
    578: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '秘本宝库迦巴勒幻想图书馆',
            'de': 'Große Gubal-Bibliothek (schwer)',
            'en': 'The Great Gubal Library (Hard)',
            'fr': 'La Grande bibliothèque de Gubal (brutal)',
            'ja': '稀書回収 グブラ幻想図書館 (Hard)',
            'ko': '구브라 환상도서관(어려움)',
        },
        'offsetX': 116,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    579: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '九宫幻卡：幻卡对局室',
            'de': 'Triple Triad: Weltensalon',
            'en': 'The Triple Triad Battlehall',
            'fr': 'Arène Triple Triade',
            'ja': 'トリプルトライアド：カードバトルルーム',
            'ko': '트리플 트라이어드: 카드 대결장',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 800,
        'weatherRate': 0,
    },
    580: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章1',
            'de': 'Alexander - Augen des Schöpfers',
            'en': 'Alexander - The Eyes of the Creator',
            'fr': 'Alexander - Les Yeux du Créateur',
            'ja': '機工城アレキサンダー：天動編1',
            'ko': '기공성 알렉산더: 천동편 1',
        },
        'offsetX': 75,
        'offsetY': 14,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    581: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章2',
            'de': 'Alexander - Atem des Schöpfers',
            'en': 'Alexander - The Breath of the Creator',
            'fr': 'Alexander - Le Souffle du Créateur',
            'ja': '機工城アレキサンダー：天動編2',
            'ko': '기공성 알렉산더: 천동편 2',
        },
        'offsetX': 0,
        'offsetY': -80,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    582: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章3',
            'de': 'Alexander - Herz des Schöpfers',
            'en': 'Alexander - The Heart of the Creator',
            'fr': 'Alexander - Le Cœur du Créateur',
            'ja': '機工城アレキサンダー：天動編3',
            'ko': '기공성 알렉산더: 천동편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    583: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章4',
            'de': 'Alexander - Seele des Schöpfers',
            'en': 'Alexander - The Soul of the Creator',
            'fr': 'Alexander - L\'Âme du Créateur',
            'ja': '機工城アレキサンダー：天動編4',
            'ko': '기공성 알렉산더: 천동편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    584: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章1',
            'de': 'Alexander - Augen des Schöpfers (episch)',
            'en': 'Alexander - The Eyes of the Creator (Savage)',
            'fr': 'Alexander - Les Yeux du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編1',
            'ko': '기공성 알렉산더: 천동편(영웅) 1',
        },
        'offsetX': 75,
        'offsetY': 14,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    585: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章2',
            'de': 'Alexander - Atem des Schöpfers (episch)',
            'en': 'Alexander - The Breath of the Creator (Savage)',
            'fr': 'Alexander - Le Souffle du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編2',
            'ko': '기공성 알렉산더: 천동편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': -80,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    586: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章3',
            'de': 'Alexander - Herz des Schöpfers (episch)',
            'en': 'Alexander - The Heart of the Creator (Savage)',
            'fr': 'Alexander - Le Cœur du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編3',
            'ko': '기공성 알렉산더: 천동편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    587: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章4',
            'de': 'Alexander - Seele des Schöpfers (episch)',
            'en': 'Alexander - The Soul of the Creator (Savage)',
            'fr': 'Alexander - L\'Âme du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編4',
            'ko': '기공성 알렉산더: 천동편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    589: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：玩家对战（绩点赛）',
            'de': 'Kampf der Trabanten: Gegen Spieler (um RP)',
            'en': 'LoVM: Player Battle (RP)',
            'fr': 'Bataille simple contre un joueur (avec PR)',
            'ja': 'LoVM：プレイヤー対戦 (RP変動あり)',
            'ko': '꼬마 친구 공방전: 플레이어 대결(RP 변동 있음)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    590: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：大赛对战（玩家对战）',
            'de': 'Kampf der Trabanten: Turnier (gegen Spieler)',
            'en': 'LoVM: Tournament',
            'fr': 'Bataille de tournoi contre des joueurs',
            'ja': 'LoVM：大会対戦 (プレイヤー対戦）',
            'ko': '꼬마 친구 공방전: 대회 대결(플레이어 대결)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    591: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：玩家对战（无绩点赛）',
            'de': 'Kampf der Trabanten: Gegen Spieler (ohne RP)',
            'en': 'LoVM: Player Battle (Non-RP)',
            'fr': 'Bataille simple contre un joueur (sans PR)',
            'ja': 'LoVM：プレイヤー対戦 (RP変動なし)',
            'ko': '꼬마 친구 공방전: 플레이어 대결(RP 변동 없음)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    592: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '纠缠不清的宿命',
            'de': 'Weltenübergreifendes Schicksal',
            'en': 'One Life for One World',
            'fr': 'Destins entrecroisés',
            'ja': '絡み合う宿命',
            'ko': '뒤얽히는 숙명',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    593: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下51～60层',
            'de': 'Palast der Toten (Ebenen 51 - 60)',
            'en': 'The Palace of the Dead (Floors 51-60)',
            'fr': 'Le Palais des morts (sous-sols 51-60)',
            'ja': '死者の宮殿 B51～B60',
            'ko': '망자의 궁전 B51~B60',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    594: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下61～70层',
            'de': 'Palast der Toten (Ebenen 61 - 70)',
            'en': 'The Palace of the Dead (Floors 61-70)',
            'fr': 'Le Palais des morts (sous-sols 61-70)',
            'ja': '死者の宮殿 B61～B70',
            'ko': '망자의 궁전 B61~B70',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    595: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下71～80层',
            'de': 'Palast der Toten (Ebenen 71 - 80)',
            'en': 'The Palace of the Dead (Floors 71-80)',
            'fr': 'Le Palais des morts (sous-sols 71-80)',
            'ja': '死者の宮殿 B71～B80',
            'ko': '망자의 궁전 B71~B80',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    596: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下81～90层',
            'de': 'Palast der Toten (Ebenen 81 - 90)',
            'en': 'The Palace of the Dead (Floors 81-90)',
            'fr': 'Le Palais des morts (sous-sols 81-90)',
            'ja': '死者の宮殿 B81～B90',
            'ko': '망자의 궁전 B81~B90',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    597: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下91～100层',
            'de': 'Palast der Toten (Ebenen 91 - 100)',
            'en': 'The Palace of the Dead (Floors 91-100)',
            'fr': 'Le Palais des morts (sous-sols 91-100)',
            'ja': '死者の宮殿 B91～B100',
            'ko': '망자의 궁전 B91~B100',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    598: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下101～110层',
            'de': 'Palast der Toten (Ebenen 101 - 110)',
            'en': 'The Palace of the Dead (Floors 101-110)',
            'fr': 'Le Palais des morts (sous-sols 101-110)',
            'ja': '死者の宮殿 B101～B110',
            'ko': '망자의 궁전 B101~B110',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    599: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下111～120层',
            'de': 'Palast der Toten (Ebenen 111 - 120)',
            'en': 'The Palace of the Dead (Floors 111-120)',
            'fr': 'Le Palais des morts (sous-sols 111-120)',
            'ja': '死者の宮殿 B111～B120',
            'ko': '망자의 궁전 B111~B120',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    600: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下121～130层',
            'de': 'Palast der Toten (Ebenen 121 - 130)',
            'en': 'The Palace of the Dead (Floors 121-130)',
            'fr': 'Le Palais des morts (sous-sols 121-130)',
            'ja': '死者の宮殿 B121～B130',
            'ko': '망자의 궁전 B121~B130',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    601: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下131～140层',
            'de': 'Palast der Toten (Ebenen 131 - 140)',
            'en': 'The Palace of the Dead (Floors 131-140)',
            'fr': 'Le Palais des morts (sous-sols 131-140)',
            'ja': '死者の宮殿 B131～B140',
            'ko': '망자의 궁전 B131~B140',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    602: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下141～150层',
            'de': 'Palast der Toten (Ebenen 141 - 150)',
            'en': 'The Palace of the Dead (Floors 141-150)',
            'fr': 'Le Palais des morts (sous-sols 141-150)',
            'ja': '死者の宮殿 B141～B150',
            'ko': '망자의 궁전 B141~B150',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    603: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下151～160层',
            'de': 'Palast der Toten (Ebenen 151 - 160)',
            'en': 'The Palace of the Dead (Floors 151-160)',
            'fr': 'Le Palais des morts (sous-sols 151-160)',
            'ja': '死者の宮殿 B151～B160',
            'ko': '망자의 궁전 B151~B160',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    604: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下161～170层',
            'de': 'Palast der Toten (Ebenen 161 - 170)',
            'en': 'The Palace of the Dead (Floors 161-170)',
            'fr': 'Le Palais des morts (sous-sols 161-170)',
            'ja': '死者の宮殿 B161～B170',
            'ko': '망자의 궁전 B161~B170',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    605: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下171～180层',
            'de': 'Palast der Toten (Ebenen 171 - 180)',
            'en': 'The Palace of the Dead (Floors 171-180)',
            'fr': 'Le Palais des morts (sous-sols 171-180)',
            'ja': '死者の宮殿 B171～B180',
            'ko': '망자의 궁전 B171~B180',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    606: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下181～190层',
            'de': 'Palast der Toten (Ebenen 181 - 190)',
            'en': 'The Palace of the Dead (Floors 181-190)',
            'fr': 'Le Palais des morts (sous-sols 181-190)',
            'ja': '死者の宮殿 B181～B190',
            'ko': '망자의 궁전 B181~B190',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    607: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下191～200层',
            'de': 'Palast der Toten (Ebenen 191 - 200)',
            'en': 'The Palace of the Dead (Floors 191-200)',
            'fr': 'Le Palais des morts (sous-sols 191-200)',
            'ja': '死者の宮殿 B191～B200',
            'ko': '망자의 궁전 B191~B200',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    612: {
        'exVersion': 2,
        'name': {
            'cn': '基拉巴尼亚边区',
            'de': 'Abanisches Grenzland',
            'en': 'The Fringes',
            'fr': 'Les Marges',
            'ja': 'ギラバニア辺境地帯',
            'ko': '기라바니아 변방지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 79,
    },
    613: {
        'exVersion': 2,
        'name': {
            'cn': '红玉海',
            'de': 'Rubinsee',
            'en': 'The Ruby Sea',
            'fr': 'Mer de Rubis',
            'ja': '紅玉海',
            'ko': '홍옥해',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 83,
    },
    614: {
        'exVersion': 2,
        'name': {
            'cn': '延夏',
            'de': 'Yanxia',
            'en': 'Yanxia',
            'fr': 'Yanxia',
            'ja': 'ヤンサ',
            'ko': '얀샤',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 84,
    },
    615: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '坚牢铁壁巴埃萨长城',
            'de': 'Baelsar-Wall',
            'en': 'Baelsar\'s Wall',
            'fr': 'La Muraille de Baelsar',
            'ja': '巨大防壁 バエサルの長城',
            'ko': '바일사르 장성',
        },
        'offsetX': 182,
        'offsetY': 32,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    616: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '海底宫殿紫水宫',
            'de': 'Shisui',
            'en': 'Shisui of the Violet Tides',
            'fr': 'Le Palais aux Marées violettes',
            'ja': '海底宮殿 紫水宮',
            'ko': '시스이 궁',
        },
        'offsetX': 0,
        'offsetY': 35,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    617: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '天山深境索姆阿尔灵峰',
            'de': 'Sohm Al (schwer)',
            'en': 'Sohm Al (Hard)',
            'fr': 'Sohm Al (brutal)',
            'ja': '霊峰浄化 ソーム・アル (Hard)',
            'ko': '솜 알(어려움)',
        },
        'offsetX': 128,
        'offsetY': -32,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    619: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (狼狱演习场：自定赛)',
            'de': 'The Feast (Wolfshöhle: Schaukampf)',
            'en': 'The Feast (Custom Match - Feasting Grounds)',
            'fr': 'The Feast (personnalisé/Festin des loups)',
            'ja': 'ザ・フィースト (ウルヴズジェイル演習場：カスタムマッチ）',
            'ko': '더 피스트 (늑대우리 훈련장: 친선 경기)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 65,
    },
    620: {
        'exVersion': 2,
        'name': {
            'cn': '基拉巴尼亚山区',
            'de': 'Die Zinnen',
            'en': 'The Peaks',
            'fr': 'Les Pics',
            'ja': 'ギラバニア山岳地帯',
            'ko': '기라바니아 산악지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 80,
    },
    621: {
        'exVersion': 2,
        'name': {
            'cn': '基拉巴尼亚湖区',
            'de': 'Das Fenn',
            'en': 'The Lochs',
            'fr': 'Les Lacs',
            'ja': 'ギラバニア湖畔地帯',
            'ko': '기라바니아 호반지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 81,
    },
    622: {
        'exVersion': 2,
        'name': {
            'cn': '太阳神草原',
            'de': 'Azim-Steppe',
            'en': 'The Azim Steppe',
            'fr': 'Steppe d\'Azim',
            'ja': 'アジムステップ',
            'ko': '아짐 대초원',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    623: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '试炼行路巴儿达木霸道',
            'de': 'Bardams Probe',
            'en': 'Bardam\'s Mettle',
            'fr': 'La Force de Bardam',
            'ja': '伝統試練 バルダム覇道',
            'ko': '바르담 패도',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    624: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛白昼探索（狩猎专用）',
            'de': 'Das Diadem - Jagdgründe (leicht)',
            'en': 'The Diadem Hunting Grounds (Easy)',
            'fr': 'Le Diadème<Indent/>: terrains de chasse (facile)',
            'ja': '雲海探索 ディアデム諸島：狩猟限定 (Easy)',
            'ko': '디아뎀 제도: 전투 한정(쉬움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 60,
    },
    625: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛黄昏探索（狩猎专用）',
            'de': 'Das Diadem - Jagdgründe',
            'en': 'The Diadem Hunting Grounds',
            'fr': 'Le Diadème<Indent/>: terrains de chasse',
            'ja': '雲海探索 ディアデム諸島：狩猟限定',
            'ko': '디아뎀 제도: 전투 한정',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 61,
    },
    626: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '漂流海域妖歌海',
            'de': 'Sirenen-See',
            'en': 'The Sirensong Sea',
            'fr': 'La Mer du Chant des sirènes',
            'ja': '漂流海域 セイレーン海',
            'ko': '세이렌 해',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 36,
    },
    627: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '影之国',
            'de': 'Dun Scaith',
            'en': 'Dun Scaith',
            'fr': 'Dun Scaith',
            'ja': '影の国ダン・スカー',
            'ko': '둔 스카',
        },
        'offsetX': -350,
        'offsetY': -400,
        'sizeFactor': 200,
        'weatherRate': 58,
    },
    628: {
        'exVersion': 2,
        'name': {
            'cn': '黄金港',
            'de': 'Kugane',
            'en': 'Kugane',
            'fr': 'Kugane',
            'ja': 'クガネ',
            'ko': '쿠가네',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 82,
    },
    630: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛战争神猎场',
            'de': 'Das Diadem - Halones Prüfung',
            'en': 'The Diadem - Trials of the Fury',
            'fr': 'Le Diadème - Épreuves de Halone',
            'ja': '雲海探索 ディアデム諸島 (狩猟)',
            'ko': '디아뎀 제도: 전투',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 71,
    },
    633: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '加尔提诺平原遭遇战',
            'de': 'Heliodrom',
            'en': 'The Carteneau Flats: Heliodrome',
            'fr': 'Rixe à l\'Héliodrome',
            'ja': 'カルテノー平原遭遇戦',
            'ko': '카르테노 평원 조우전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    635: {
        'exVersion': 2,
        'name': {
            'cn': '神拳痕',
            'de': 'Rhalgrs Wacht',
            'en': 'Rhalgr\'s Reach',
            'fr': 'L\'Étendue de Rhalgr',
            'ja': 'ラールガーズリーチ',
            'ko': '랄거의 손길',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 78,
    },
    637: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '祖尔宛歼灭战',
            'de': 'Götterdämmerung - Zurvan',
            'en': 'Containment Bay Z1T9',
            'fr': 'Unité de contention Z1P9',
            'ja': '鬼神ズルワーン討滅戦',
            'ko': '귀신 주르반 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 75,
    },
    638: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '祖尔宛歼殛战',
            'de': 'Zenit der Götter - Zurvan',
            'en': 'Containment Bay Z1T9 (Extreme)',
            'fr': 'Unité de contention Z1P9 (extrême)',
            'ja': '極鬼神ズルワーン討滅戦',
            'ko': '극 귀신 주르반 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 75,
    },
    646: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (地衣宫演习场：自定赛)',
            'de': 'The Feast (Flechtenhain: Schaukampf)',
            'en': 'The Feast (Custom Match - Lichenweed)',
            'fr': 'The Feast (personnalisé/Pré-de-lichen)',
            'ja': 'ザ・フィースト (ライケンウィード演習場：カスタムマッチ）',
            'ko': '더 피스트 (잡초 훈련장: 친선 경기)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 73,
    },
    656: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛丰饶神福地',
            'de': 'Das Diadem - Nophicas Prüfung',
            'en': 'The Diadem - Trials of the Matron',
            'fr': 'Le Diadème - Épreuves de Nophica',
            'ja': '雲海探索 ディアデム諸島 (採集)',
            'ko': '디아뎀 제도: 채집',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 71,
    },
    660: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '解放决战多玛王城',
            'de': 'Burg Doma',
            'en': 'Doma Castle',
            'fr': 'Le Château de Doma',
            'ja': '解放決戦 ドマ城',
            'ko': '도마 성',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    661: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '巨炮要塞帝国白山堡',
            'de': 'Castrum Abania',
            'en': 'Castrum Abania',
            'fr': 'Castrum Abania',
            'ja': '巨砲要塞 カストルム・アバニア',
            'ko': '카스트룸 아바니아',
        },
        'offsetX': 72,
        'offsetY': -186,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    662: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '恶党孤城黄金阁',
            'de': 'Schloss Kugane',
            'en': 'Kugane Castle',
            'fr': 'Le Château de Kugane',
            'ja': '悪党成敗 クガネ城',
            'ko': '쿠가네 성',
        },
        'offsetX': 70,
        'offsetY': 33,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    663: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '修行古刹星导寺',
            'de': 'Tempel der Faust',
            'en': 'The Temple of the Fist',
            'fr': 'Le Temple du Poing',
            'ja': '壊神修行 星導山寺院',
            'ko': '성도산 사원',
        },
        'offsetX': -427,
        'offsetY': -314,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    665: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '鱼道现身！',
            'de': 'Ein zweifelhaftes Angebot',
            'en': 'It\'s Probably a Trap',
            'fr': 'Un drôle de Namazu',
            'ja': 'ギョドウ現る！',
            'ko': '교도 등장!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    674: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '须佐之男歼灭战',
            'de': 'Götterdämmerung - Susano',
            'en': 'The Pool of Tribute',
            'fr': 'La Crique aux tributs',
            'ja': 'スサノオ討滅戦',
            'ko': '스사노오 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 77,
    },
    677: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '须佐之男歼殛战',
            'de': 'Zenit der Götter - Susano',
            'en': 'The Pool of Tribute (Extreme)',
            'fr': 'La Crique aux tributs (extrême)',
            'ja': '極スサノオ討滅戦',
            'ko': '극 스사노오 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 77,
    },
    679: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '神龙歼灭战',
            'de': 'Königliche Menagerie',
            'en': 'The Royal Menagerie',
            'fr': 'La Ménagerie royale',
            'ja': '神龍討滅戦',
            'ko': '신룡 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 76,
    },
    684: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '于里昂热的秘策',
            'de': 'Wege zur Transzendenz',
            'en': 'The Resonant',
            'fr': 'La ruse d\'Urianger',
            'ja': 'ウリエンジェの秘策',
            'ko': '위리앙제의 비책',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    688: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '那达慕',
            'de': 'Naadam',
            'en': 'Naadam',
            'fr': 'La grande bataille du Naadam',
            'ja': '終節の合戦',
            'ko': '계절끝 합전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    689: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '鏖战红莲阿拉米格',
            'de': 'Ala Mhigo',
            'en': 'Ala Mhigo',
            'fr': 'Ala Mhigo',
            'ja': '紅蓮決戦 アラミゴ',
            'ko': '알라미고',
        },
        'offsetX': 292,
        'offsetY': -163,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    690: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '时空狭缝外缘',
            'de': 'Interdimensionaler Riss',
            'en': 'Interdimensional Rift',
            'fr': 'Fissure interdimensionnelle',
            'ja': '次元の狭間：外縁',
            'ko': '차원의 틈: 외곽',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 88,
    },
    691: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境1',
            'de': 'Deltametrie 1.0',
            'en': 'Deltascape V1.0',
            'fr': 'Deltastice v1.0',
            'ja': '次元の狭間オメガ：デルタ編1',
            'ko': '차원의 틈 오메가: 델타편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    692: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境2',
            'de': 'Deltametrie 2.0',
            'en': 'Deltascape V2.0',
            'fr': 'Deltastice v2.0',
            'ja': '次元の狭間オメガ：デルタ編2',
            'ko': '차원의 틈 오메가: 델타편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    693: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境3',
            'de': 'Deltametrie 3.0',
            'en': 'Deltascape V3.0',
            'fr': 'Deltastice v3.0',
            'ja': '次元の狭間オメガ：デルタ編3',
            'ko': '차원의 틈 오메가: 델타편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    694: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境4',
            'de': 'Deltametrie 4.0',
            'en': 'Deltascape V4.0',
            'fr': 'Deltastice v4.0',
            'ja': '次元の狭間オメガ：デルタ編4',
            'ko': '차원의 틈 오메가: 델타편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    695: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境1',
            'de': 'Deltametrie 1.0 (episch)',
            'en': 'Deltascape V1.0 (Savage)',
            'fr': 'Deltastice v1.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編1',
            'ko': '차원의 틈 오메가: 델타편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    696: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境2',
            'de': 'Deltametrie 2.0 (episch)',
            'en': 'Deltascape V2.0 (Savage)',
            'fr': 'Deltastice v2.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編2',
            'ko': '차원의 틈 오메가: 델타편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    697: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境3',
            'de': 'Deltametrie 3.0 (episch)',
            'en': 'Deltascape V3.0 (Savage)',
            'fr': 'Deltastice v3.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編3',
            'ko': '차원의 틈 오메가: 델타편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    698: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境4',
            'de': 'Deltametrie 4.0 (episch)',
            'en': 'Deltascape V4.0 (Savage)',
            'fr': 'Deltastice v4.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編4',
            'ko': '차원의 틈 오메가: 델타편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    705: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '大会开始',
            'de': 'Thal zu Ehren',
            'en': 'In Thal\'s Name',
            'fr': 'Le tournoi commémoratif du sultanat',
            'ja': 'ウル王杯闘技会の始まり',
            'ko': '울다하 왕실배 투기대회',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 8,
    },
    706: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '为了更强',
            'de': 'Die hohe Kunst des Schwertkampfs',
            'en': 'Raising the Sword',
            'fr': 'La finale des champions',
            'ja': 'さらなる剣術の高みへ',
            'ko': '더 높은 검술의 경지로',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 8,
    },
    707: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '抗争之力',
            'de': 'Die Kraft des Widerstands',
            'en': 'With Heart and Steel',
            'fr': 'Transmigration démoniaque',
            'ja': '抗う力',
            'ko': '맞서는 힘',
        },
        'offsetX': 298,
        'offsetY': 350,
        'sizeFactor': 200,
        'weatherRate': 37,
    },
    708: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '海都路人身首异',
            'de': 'Mord ist sein Hobby',
            'en': 'Blood on the Deck',
            'fr': 'La légende de Musosai<Indent/>: l\'assassin de Limsa Lominsa',
            'ja': '海都を震わす人斬りの宴！',
            'ko': '해양도시를 흔드는 살인자의 연회!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    709: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '极恶之人木枯',
            'de': 'Der Inbegriff des Bösen',
            'en': 'The Face of True Evil',
            'fr': 'L\'abominable Kogarashi',
            'ja': '極悪人コガラシ',
            'ko': '극악무도한 코가라시',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 49,
    },
    710: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '松叶门外之变',
            'de': 'Vorfall auf dem Matsuba-Platz',
            'en': 'Matsuba Mayhem',
            'fr': 'Règlement de compte au square Matsuba',
            'ja': '松葉門外の変',
            'ko': '마츠바 사변',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 82,
    },
    711: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '决战龟甲岛',
            'de': 'Ent<SoftHyphen/>schei<SoftHyphen/>dungs<SoftHyphen/>schlacht auf Bekko',
            'en': 'The Battle on Bekko',
            'fr': 'L\'af<SoftHyphen/>fron<SoftHyphen/>te<SoftHyphen/>ment de deux justices',
            'ja': 'ベッコウ島の決闘',
            'ko': '베코우 섬의 결투',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 83,
    },
    712: {
        'contentType': 9,
        'exVersion': 2,
        'name': {
            'cn': '运河宝物库',
            'de': 'Kanäle von Uznair',
            'en': 'The Lost Canals of Uznair',
            'fr': 'Les Canaux perdus d\'Uznair',
            'ja': '宝物庫 ウズネアカナル',
            'ko': '보물고 우즈네어 운하',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    713: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '漆黑的巨龙',
            'de': 'Der tobende Drache',
            'en': 'Dark as the Night Sky',
            'fr': 'Aussi sombre que la nuit',
            'ja': '漆黒の巨竜',
            'ko': '칠흑의 거룡',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    714: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '红血之龙骑士',
            'de': 'Der Rubin-Drachenreiter',
            'en': 'Dragon Sound',
            'fr': 'Le Dragon écarlate',
            'ja': '紅の竜騎士',
            'ko': '붉은 용기사',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    715: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '遥远的憧憬',
            'de': 'Probe des Meisters',
            'en': 'The Orphans and the Broken Blade',
            'fr': 'L\'aspiration refoulée',
            'ja': 'あと三度、遥かな憧憬',
            'ko': '앞으로 세 번, 아득한 동경',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 86,
    },
    716: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '再次相见',
            'de': 'Aus der Tiefe des Herzens',
            'en': 'Our Compromise',
            'fr': 'La dernière séparation',
            'ja': 'あと一度、君に会えたら',
            'ko': '앞으로 한 번, 너와 만날 수 있다면',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 28,
    },
    717: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '原初的战士',
            'de': 'Die Urkraft in ihr',
            'en': 'Curious Gorge Meets His Match',
            'fr': 'L\'épreuve de force',
            'ja': '原初的な彼女',
            'ko': '원초적 그녀',
        },
        'offsetX': -77,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    718: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '燃烧吧高吉',
            'de': 'Kriegerische Leidenschaft',
            'en': 'The Heart of the Problem',
            'fr': 'Passion guerrière',
            'ja': '燃えよゴージ！',
            'ko': '불타올라라, 산골짜기!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    719: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '吉祥天女歼灭战',
            'de': 'Götterdämmerung - Lakshmi',
            'en': 'Emanation',
            'fr': 'Émanation',
            'ja': 'ラクシュミ討滅戦',
            'ko': '락슈미 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 87,
    },
    720: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '吉祥天女歼殛战',
            'de': 'Zenit der Götter - Lakshmi',
            'en': 'Emanation (Extreme)',
            'fr': 'Émanation (extrême)',
            'ja': '極ラクシュミ討滅戦',
            'ko': '극 락슈미 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 87,
    },
    722: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '穿越时空的夙愿',
            'de': 'Ein Wunsch aus alten Zeiten',
            'en': 'Our Unsung Heroes',
            'fr': 'L\'espoir en héritage',
            'ja': '時をかける願い',
            'ko': '시간을 뛰어넘은 염원',
        },
        'offsetX': -175,
        'offsetY': -297,
        'sizeFactor': 200,
        'weatherRate': 63,
    },
    723: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '影隐忍法贴',
            'de': 'Aus dem Verborgenen',
            'en': 'When Clans Collide',
            'fr': 'La bataille des clans',
            'ja': '影隠忍法帖',
            'ko': '그림자 인법첩',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    725: {
        'contentType': 9,
        'exVersion': 2,
        'name': {
            'cn': '运河宝物库深层',
            'de': 'Vergessene Kanäle von Uznair',
            'en': 'The Hidden Canals of Uznair',
            'fr': 'Les Canaux cachés d\'Uznair',
            'ja': '宝物庫 ウズネアカナル深層',
            'ko': '보물고 우즈네어 운하 심층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    729: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '距骨研究所 (机动战)',
            'de': 'Astragalos',
            'en': 'Astragalos',
            'fr': 'Astragalos (machinerie)',
            'ja': 'アストラガロス (機工戦)',
            'ko': '아스트라갈로스(기공전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    730: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '神龙梦幻歼灭战',
            'de': 'Heldenlied von Shinryu',
            'en': 'The Minstrel\'s Ballad: Shinryu\'s Domain',
            'fr': 'Le domaine de Shinryu',
            'ja': '極神龍討滅戦',
            'ko': '극 신룡 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 76,
    },
    731: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '沉没神殿斯卡拉遗迹',
            'de': 'Die versunkene Stadt Skalla',
            'en': 'The Drowned City of Skalla',
            'fr': 'La Cité engloutie de Skalla',
            'ja': '水没遺構 スカラ',
            'ko': '스칼라 유적',
        },
        'offsetX': 185,
        'offsetY': 5,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    732: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 常风之地',
            'de': 'Eureka Anemos',
            'en': 'The Forbidden Land, Eureka Anemos',
            'fr': 'Eurêka Anemos',
            'ja': '禁断の地 エウレカ：アネモス編',
            'ko': '금단의 땅 에우레카: 아네모스편',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 91,
    },
    733: {
        'contentType': 28,
        'exVersion': 2,
        'name': {
            'cn': '巴哈姆特绝境战',
            'de': 'Endlose Schatten von Bahamut (fatal)',
            'en': 'The Unending Coil of Bahamut (Ultimate)',
            'fr': 'L\'Abîme infini de Bahamut (fatal)',
            'ja': '絶バハムート討滅戦',
            'ko': '절 바하무트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    734: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '失落之都拉巴纳斯塔',
            'de': 'Rabanastre',
            'en': 'The Royal City of Rabanastre',
            'fr': 'La Cité royale de Rabanastre',
            'ja': '失われた都 ラバナスタ',
            'ko': '왕도 라바나스터',
        },
        'offsetX': 300,
        'offsetY': -100,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    741: {
        'contentType': 22,
        'exVersion': 0,
        'name': {
            'cn': '良缘仪式',
            'de': 'Valentionzeremonie',
            'en': 'The Valentione\'s Ceremony',
            'fr': 'La Cérémonie de la Valention',
            'ja': 'ヴァレンティオンセレモニー',
            'ko': '발렌티온 예식장',
        },
        'offsetX': 0,
        'offsetY': 125,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    742: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '红玉火山狱之盖',
            'de': 'Höllenspund',
            'en': 'Hells\' Lid',
            'fr': 'Le Couvercle des enfers',
            'ja': '紅玉火山 獄之蓋',
            'ko': '지옥뚜껑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    743: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '疯狂战舰无限回廊',
            'de': 'Die Fraktal-Kontinuum (schwer)',
            'en': 'The Fractal Continuum (Hard)',
            'fr': 'Le Continuum fractal (brutal)',
            'ja': '暴走戦艦 フラクタル・コンティニアム (Hard)',
            'ko': '무한연속 박물함(어려움)',
        },
        'offsetX': 0,
        'offsetY': 350,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    745: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (战队段位赛)',
            'de': 'The Feast (Team, gewertet)',
            'en': 'The Feast (Team Ranked)',
            'fr': 'The Feast (classé/équipe JcJ)',
            'ja': 'ザ・フィースト (チーム用ランクマッチ)',
            'ko': '더 피스트 (팀 등급전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    746: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '白虎镇魂战',
            'de': 'Seelentanz - Byakko',
            'en': 'The Jade Stoa',
            'fr': 'La Clairière de Jade',
            'ja': '白虎征魂戦',
            'ko': '백호 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 93,
    },
    748: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境1',
            'de': 'Sigmametrie 1.0',
            'en': 'Sigmascape V1.0',
            'fr': 'Sigmastice v1.0',
            'ja': '次元の狭間オメガ：シグマ編1',
            'ko': '차원의 틈 오메가: 시그마편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    749: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境2',
            'de': 'Sigmametrie 2.0',
            'en': 'Sigmascape V2.0',
            'fr': 'Sigmastice v2.0',
            'ja': '次元の狭間オメガ：シグマ編2',
            'ko': '차원의 틈 오메가: 시그마편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    750: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境3',
            'de': 'Sigmametrie 3.0',
            'en': 'Sigmascape V3.0',
            'fr': 'Sigmastice v3.0',
            'ja': '次元の狭間オメガ：シグマ編3',
            'ko': '차원의 틈 오메가: 시그마편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    751: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境4',
            'de': 'Sigmametrie 4.0',
            'en': 'Sigmascape V4.0',
            'fr': 'Sigmastice v4.0',
            'ja': '次元の狭間オメガ：シグマ編4',
            'ko': '차원의 틈 오메가: 시그마편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    752: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境1',
            'de': 'Sigmametrie 1.0 (episch)',
            'en': 'Sigmascape V1.0 (Savage)',
            'fr': 'Sigmastice v1.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編1',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    753: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境2',
            'de': 'Sigmametrie 2.0 (episch)',
            'en': 'Sigmascape V2.0 (Savage)',
            'fr': 'Sigmastice v2.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編2',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    754: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境3',
            'de': 'Sigmametrie 3.0 (episch)',
            'en': 'Sigmascape V3.0 (Savage)',
            'fr': 'Sigmastice v3.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編3',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    755: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境4',
            'de': 'Sigmametrie 4.0 (episch)',
            'en': 'Sigmascape V4.0 (Savage)',
            'fr': 'Sigmastice v4.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編4',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    758: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '白虎诗魂战',
            'de': 'Seelensturm - Byakko',
            'en': 'The Jade Stoa (Extreme)',
            'fr': 'La Clairière de Jade (extrême)',
            'ja': '極白虎征魂戦',
            'ko': '극 백호 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 93,
    },
    759: {
        'exVersion': 2,
        'name': {
            'cn': '多玛飞地',
            'de': 'Domanische Enklave',
            'en': 'The Doman Enclave',
            'fr': 'Quartier enclavé de Doma',
            'ja': 'ドマ町人地',
            'ko': '도마 도읍지',
        },
        'offsetX': 23,
        'offsetY': 34,
        'sizeFactor': 400,
        'weatherRate': 84,
    },
    761: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '火龙狩猎战',
            'de': 'Jagd auf Rathalos',
            'en': 'The Great Hunt',
            'fr': 'Chasse au Rathalos',
            'ja': 'リオレウス狩猟戦',
            'ko': '리오레우스 수렵전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    762: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '火龙上位狩猎战',
            'de': 'Jagd auf Rathalos (schwer)',
            'en': 'The Great Hunt (Extreme)',
            'fr': 'Chasse au Rathalos (extrême)',
            'ja': '極リオレウス狩猟戦',
            'ko': '극 리오레우스 수렵전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    763: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 恒冰之地',
            'de': 'Eureka Pagos',
            'en': 'The Forbidden Land, Eureka Pagos',
            'fr': 'Eurêka Pagos',
            'ja': '禁断の地 エウレカ：パゴス編',
            'ko': '금단의 땅 에우레카: 파고스편',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 94,
    },
    765: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (段位赛)',
            'de': 'The Feast (gewertet)',
            'en': 'The Feast (Ranked)',
            'fr': 'The Feast (classé)',
            'ja': 'ザ・フィースト (ランクマッチ)',
            'ko': '더 피스트 (등급전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    766: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (练习赛)',
            'de': 'The Feast (Übungskampf)',
            'en': 'The Feast (Training)',
            'fr': 'The Feast (en<SoftHyphen/>traî<SoftHyphen/>ne<SoftHyphen/>ment)',
            'ja': 'ザ・フィースト (カジュアルマッチ)',
            'ko': '더 피스트 (일반전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    767: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (水晶塔演习场：自定赛)',
            'de': 'The Feast (Kristallturm-Arena: Schaukampf)',
            'en': 'The Feast (Custom Match - Crystal Tower)',
            'fr': 'The Feast (personnalisé/Tour de Cristal)',
            'ja': 'ザ・フィースト (クリスタルタワー演習場：カスタムマッチ）',
            'ko': '더 피스트 (크리스탈 타워 훈련장: 친선 경기)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    768: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '风水灵庙岩燕庙',
            'de': 'Kompass der Schwalbe',
            'en': 'The Swallow\'s Compass',
            'fr': 'Le Compas de l\'Hirondelle',
            'ja': '風水霊殿 ガンエン廟',
            'ko': '강엔 종묘',
        },
        'offsetX': 240,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    769: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '拂晓的少年',
            'de': 'Der Knabe der Morgenröte',
            'en': 'Emissary of the Dawn',
            'fr': 'Voyage en terre hostile',
            'ja': '「暁」の少年',
            'ko': '\'새벽\'의 소년',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    770: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 1～10层',
            'de': 'Himmelssäule (Ebenen 1-10)',
            'en': 'Heaven-on-High  (Floors 1-10)',
            'fr': 'Le Pilier des Cieux (étages 1-10)',
            'ja': 'アメノミハシラ 1～10層',
            'ko': '천궁탑 1~10층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    771: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 11～20层',
            'de': 'Himmelssäule (Ebenen 11-20)',
            'en': 'Heaven-on-High  (Floors 11-20)',
            'fr': 'Le Pilier des Cieux (étages 11-20)',
            'ja': 'アメノミハシラ 11～20層',
            'ko': '천궁탑 11~20층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    772: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 21～30层',
            'de': 'Himmelssäule (Ebenen 21-30)',
            'en': 'Heaven-on-High  (Floors 21-30)',
            'fr': 'Le Pilier des Cieux (étages 21-30)',
            'ja': 'アメノミハシラ 21～30層',
            'ko': '천궁탑 21~30층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    773: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 41～50层',
            'de': 'Himmelssäule (Ebenen 41-50)',
            'en': 'Heaven-on-High  (Floors 41-50)',
            'fr': 'Le Pilier des Cieux (étages 41-50)',
            'ja': 'アメノミハシラ 41～50層',
            'ko': '천궁탑 41~50층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    774: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 61～70层',
            'de': 'Himmelssäule (Ebenen 61-70)',
            'en': 'Heaven-on-High  (Floors 61-70)',
            'fr': 'Le Pilier des Cieux (étages 61-70)',
            'ja': 'アメノミハシラ 61～70層',
            'ko': '천궁탑 61~70층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    775: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 81～90层',
            'de': 'Himmelssäule (Ebenen 81-90)',
            'en': 'Heaven-on-High  (Floors 81-90)',
            'fr': 'Le Pilier des Cieux (étages 81-90)',
            'ja': 'アメノミハシラ 81～90層',
            'ko': '천궁탑 81~90층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    776: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '封闭圣塔黎铎拉纳大灯塔',
            'de': 'Richtfeuer von Ridorana',
            'en': 'The Ridorana Lighthouse',
            'fr': 'Le Phare de Ridorana',
            'ja': '封じられた聖塔 リドルアナ',
            'ko': '대등대 리도르아나',
        },
        'offsetX': 202,
        'offsetY': -92,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    777: {
        'contentType': 28,
        'exVersion': 2,
        'name': {
            'cn': '究极神兵绝境战',
            'de': 'Heldenlied von Ultima (fatal)',
            'en': 'The Weapon\'s Refrain (Ultimate)',
            'fr': 'La Fantasmagorie d\'Ultima (fatal)',
            'ja': '絶アルテマウェポン破壊作戦',
            'ko': '절 알테마 웨폰 파괴작전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    778: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '月读歼灭战',
            'de': 'Götterdämmerung - Tsukuyomi',
            'en': 'Castrum Fluminis',
            'fr': 'Castrum Fluminis',
            'ja': 'ツクヨミ討滅戦',
            'ko': '츠쿠요미 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    779: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '月读幽夜歼灭战',
            'de': 'Zenit der Götter - Tsukuyomi',
            'en': 'The Minstrel\'s Ballad: Tsukuyomi\'s Pain',
            'fr': 'Castrum Fluminis (extrême)',
            'ja': '極ツクヨミ討滅戦',
            'ko': '극 츠쿠요미 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    782: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 31～40层',
            'de': 'Himmelssäule (Ebenen 31-40)',
            'en': 'Heaven-on-High  (Floors 31-40)',
            'fr': 'Le Pilier des Cieux (étages 31-40)',
            'ja': 'アメノミハシラ 31～40層',
            'ko': '천궁탑 31~40층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    783: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 51～60层',
            'de': 'Himmelssäule (Ebenen 51-60)',
            'en': 'Heaven-on-High  (Floors 51-60)',
            'fr': 'Le Pilier des Cieux (étages 51-60)',
            'ja': 'アメノミハシラ 51～60層',
            'ko': '천궁탑 51~60층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    784: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 71～80层',
            'de': 'Himmelssäule (Ebenen 71-80)',
            'en': 'Heaven-on-High  (Floors 71-80)',
            'fr': 'Le Pilier des Cieux (étages 71-80)',
            'ja': 'アメノミハシラ 71～80層',
            'ko': '천궁탑 71~80층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    785: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 91～100层',
            'de': 'Himmelssäule (Ebenen 91-100)',
            'en': 'Heaven-on-High  (Floors 91-100)',
            'fr': 'Le Pilier des Cieux (étages 91-100)',
            'ja': 'アメノミハシラ 91～100層',
            'ko': '천궁탑 91~100층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    788: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '污染庭园圣茉夏娜植物园',
            'de': 'Sankt Mocianne-Arboretum (schwer)',
            'en': 'Saint Mocianne\'s Arboretum (Hard)',
            'fr': 'L\'Arboretum Sainte-Mocianne (brutal)',
            'ja': '草木汚染 聖モシャーヌ植物園 (Hard)',
            'ko': '성 모샨 식물원(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    789: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '死亡大地终末焦土',
            'de': 'Das Kargland',
            'en': 'The Burn',
            'fr': 'L\'Escarre',
            'ja': '永久焦土 ザ・バーン',
            'ko': '영구 초토지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 97,
    },
    790: {
        'contentType': 22,
        'exVersion': 0,
        'name': {
            'cn': '灾厄重现军事演习',
            'de': 'Gedenkschlacht der Eorzäischen Allianz',
            'en': 'The Calamity Retold',
            'fr': 'Les grandes manœuvres commémoratives',
            'ja': '新生祭軍事演習',
            'ko': '신생제 군사훈련',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 95,
    },
    791: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '隐塞 (机动战)',
            'de': 'Verborgene Schlucht',
            'en': 'Hidden Gorge',
            'fr': 'Gorge dérobée (machinerie)',
            'ja': 'ヒドゥンゴージ (機工戦)',
            'ko': '숨겨진 보루(기공전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    792: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '虚景跳跳乐大挑战',
            'de': 'Kaktor-Kletterwand',
            'en': 'Leap of Faith',
            'fr': 'Haute voltige',
            'ja': '挑戦！ ジャンピングアスレチック',
            'ko': '뛰어라! 점핑 운동회',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    793: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '国境战线基姆利特暗区',
            'de': 'Die Ghimlyt-Finsternis',
            'en': 'The Ghimlyt Dark',
            'fr': 'Les Ténèbres de Ghimlyt',
            'ja': '境界戦線 ギムリトダーク',
            'ko': '김리트 황야',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    794: {
        'contentType': 9,
        'exVersion': 2,
        'name': {
            'cn': '运河宝物库神殿',
            'de': 'Glücksaltäre von Uznair',
            'en': 'The Shifting Altars of Uznair',
            'fr': 'Le Temple sacré d\'Uznair',
            'ja': '宝物庫 ウズネアカナル祭殿',
            'ko': '보물고 우즈네어 운하 제전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    795: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 涌火之地',
            'de': 'Eureka Pyros',
            'en': 'The Forbidden Land, Eureka Pyros',
            'fr': 'Eurêka Pyros',
            'ja': '禁断の地 エウレカ：ピューロス編',
            'ko': '금단의 땅 에우레카: 피로스편',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 96,
    },
    796: {
        'contentType': 27,
        'exVersion': 0,
        'name': {
            'cn': '出道战',
            'de': 'Debüt in der Himmlischen Arena',
            'en': 'All\'s Well That Starts Well',
            'fr': 'Début du spectacle',
            'ja': 'デビューマッチ',
            'ko': '데뷔전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    797: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '楔石洞',
            'de': 'Der Wille der Mondgöttin',
            'en': 'The Will of the Moon',
            'fr': 'Ralliement dans la steppe',
            'ja': '楔石の虚',
            'ko': '쐐기돌 동굴',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    798: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境1',
            'de': 'Alphametrie 1.0',
            'en': 'Alphascape V1.0',
            'fr': 'Alphastice v1.0',
            'ja': '次元の狭間オメガ：アルファ編1',
            'ko': '차원의 틈 오메가: 알파편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    799: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境2',
            'de': 'Alphametrie 2.0',
            'en': 'Alphascape V2.0',
            'fr': 'Alphastice v2.0',
            'ja': '次元の狭間オメガ：アルファ編2',
            'ko': '차원의 틈 오메가: 알파편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    800: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境3',
            'de': 'Alphametrie 3.0',
            'en': 'Alphascape V3.0',
            'fr': 'Alphastice v3.0',
            'ja': '次元の狭間オメガ：アルファ編3',
            'ko': '차원의 틈 오메가: 알파편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    801: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境4',
            'de': 'Alphametrie 4.0',
            'en': 'Alphascape V4.0',
            'fr': 'Alphastice v4.0',
            'ja': '次元の狭間オメガ：アルファ編4',
            'ko': '차원의 틈 오메가: 알파편 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    802: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境1',
            'de': 'Alphametrie 1.0 (episch)',
            'en': 'Alphascape V1.0 (Savage)',
            'fr': 'Alphastice v1.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編1',
            'ko': '차원의 틈 오메가: 알파편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    803: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境2',
            'de': 'Alphametrie 2.0 (episch)',
            'en': 'Alphascape V2.0 (Savage)',
            'fr': 'Alphastice v2.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編2',
            'ko': '차원의 틈 오메가: 알파편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    804: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境3',
            'de': 'Alphametrie 3.0 (episch)',
            'en': 'Alphascape V3.0 (Savage)',
            'fr': 'Alphastice v3.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編3',
            'ko': '차원의 틈 오메가: 알파편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    805: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境4',
            'de': 'Alphametrie 4.0 (episch)',
            'en': 'Alphascape V4.0 (Savage)',
            'fr': 'Alphastice v4.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編4',
            'ko': '차원의 틈 오메가: 알파편(영웅) 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    806: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '保镖歼灭战',
            'de': 'Duell auf der Kugane-Brücke',
            'en': 'Kugane Ohashi',
            'fr': 'Le Pont Ohashi',
            'ja': '真ヨウジンボウ討滅戦',
            'ko': '진 요우진보 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    810: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '朱雀镇魂战',
            'de': 'Seelentanz - Suzaku',
            'en': 'Hells\' Kier',
            'fr': 'Le Nid des Lamentations',
            'ja': '朱雀征魂戦',
            'ko': '주작 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 98,
    },
    811: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '朱雀诗魂战',
            'de': 'Seelensturm - Suzaku',
            'en': 'Hells\' Kier (Extreme)',
            'fr': 'Le Nid des Lamentations (extrême)',
            'ja': '極朱雀征魂戦',
            'ko': '극 주작 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 98,
    },
    813: {
        'exVersion': 3,
        'name': {
            'cn': '雷克兰德',
            'de': 'Seenland',
            'en': 'Lakeland',
            'fr': 'Grand-Lac',
            'ja': 'レイクランド',
            'ko': '레이크랜드',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 106,
    },
    814: {
        'exVersion': 3,
        'name': {
            'cn': '珂露西亚岛',
            'de': 'Kholusia',
            'en': 'Kholusia',
            'fr': 'Kholusia',
            'ja': 'コルシア島',
            'ko': '콜루시아 섬',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 107,
    },
    815: {
        'exVersion': 3,
        'name': {
            'cn': '安穆·艾兰',
            'de': 'Amh Araeng',
            'en': 'Amh Araeng',
            'fr': 'Amh Araeng',
            'ja': 'アム・アレーン',
            'ko': '아므 아랭',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 108,
    },
    816: {
        'exVersion': 3,
        'name': {
            'cn': '伊尔美格',
            'de': 'Il Mheg',
            'en': 'Il Mheg',
            'fr': 'Il Mheg',
            'ja': 'イル・メグ',
            'ko': '일 메그',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 109,
    },
    817: {
        'exVersion': 3,
        'name': {
            'cn': '拉凯提卡大森林',
            'de': 'Der Große Wald Rak\'tika',
            'en': 'The Rak\'tika Greatwood',
            'fr': 'Rak\'tika',
            'ja': 'ラケティカ大森林',
            'ko': '라케티카 대삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 110,
    },
    818: {
        'exVersion': 3,
        'name': {
            'cn': '黑风海',
            'de': 'Tempest',
            'en': 'The Tempest',
            'fr': 'La Tempête',
            'ja': 'テンペスト',
            'ko': '템페스트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 111,
    },
    819: {
        'exVersion': 3,
        'name': {
            'cn': '水晶都',
            'de': 'Crystarium',
            'en': 'The Crystarium',
            'fr': 'Cristarium',
            'ja': 'クリスタリウム',
            'ko': '크리스타리움',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 112,
    },
    820: {
        'exVersion': 3,
        'name': {
            'cn': '游末邦',
            'de': 'Eulmore',
            'en': 'Eulmore',
            'fr': 'Eulmore',
            'ja': 'ユールモア',
            'ko': '율모어',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 113,
    },
    821: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '水妖幻园多恩美格禁园',
            'de': 'Dohn Mheg',
            'en': 'Dohn Mheg',
            'fr': 'Dohn Mheg',
            'ja': '水妖幻園 ドォーヌ・メグ',
            'ko': '도느 메그',
        },
        'offsetX': 0,
        'offsetY': 200,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    822: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '伪造天界格鲁格火山',
            'de': 'Der Gulg',
            'en': 'Mt. Gulg',
            'fr': 'Mont Gulg',
            'ja': '偽造天界 グルグ火山',
            'ko': '굴그 화산',
        },
        'offsetX': -188,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    823: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '文明古迹奇坦那神影洞',
            'de': 'Irrungen der Qitari',
            'en': 'The Qitana Ravel',
            'fr': 'L\'Enchevêtrement des Qitari',
            'ja': '古跡探索 キタンナ神影洞',
            'ko': '키타나 신굴',
        },
        'offsetX': 0,
        'offsetY': -274,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    824: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '青龙镇魂战',
            'de': 'Seelentanz - Seiryu',
            'en': 'The Wreath of Snakes',
            'fr': 'L\'Îlot des Amertumes',
            'ja': '青龍征魂戦',
            'ko': '청룡 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 99,
    },
    825: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '青龙诗魂战',
            'de': 'Seelensturm - Seiryu',
            'en': 'The Wreath of Snakes (Extreme)',
            'fr': 'L\'Îlot des Amertumes (extrême)',
            'ja': '極青龍征魂戦',
            'ko': '극 청룡 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 99,
    },
    826: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '乐欲之所瓯博讷修道院',
            'de': 'Kloster von Orbonne',
            'en': 'The Orbonne Monastery',
            'fr': 'Le Monastère d\'Orbonne',
            'ja': '楽欲の僧院 オーボンヌ',
            'ko': '오본느 수도원',
        },
        'offsetX': -545,
        'offsetY': -663,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    827: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 丰水之地',
            'de': 'Eureka Hydatos',
            'en': 'The Forbidden Land, Eureka Hydatos',
            'fr': 'Eurêka Hydatos',
            'ja': '禁断の地 エウレカ：ヒュダトス編',
            'ko': '금단의 땅 에우레카: 히다토스편',
        },
        'offsetX': 0,
        'offsetY': 475,
        'sizeFactor': 100,
        'weatherRate': 100,
    },
    830: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '英雄挽歌',
            'de': 'Requiem der Helden',
            'en': 'A Requiem for Heroes',
            'fr': 'Un requiem pour les héros',
            'ja': '英雄への鎮魂歌',
            'ko': '영웅을 위한 진혼가',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    831: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '多玛方城战：东风战4人亲友桌（不带食断）',
            'de': '4-Spieler-Mahjong (schnelle Partie, Kuitan deaktiviert)',
            'en': 'Four-player Mahjong (Quick Match, Kuitan Disabled)',
            'fr': 'Mahjong domien<Indent/>: 4 joueurs (partie rapide sans kuitan)',
            'ja': 'ドマ式麻雀：東風戦4人セット卓（クイタン無し）',
            'ko': '작패유희: 동풍전 4인용 탁자(부르기 단요구 없음)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    832: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '空军装甲驾驶员',
            'de': 'Luftwaffe, Feuer frei!',
            'en': 'Air Force One',
            'fr': 'As de l\'air',
            'ja': '出撃！ エアフォースパイロット',
            'ko': '출격! 에어포스 조종사',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    834: {
        'contentType': 7,
        'exVersion': 0,
        'name': {
            'cn': '风之使者',
            'de': 'Durch den Sturm und zurück',
            'en': 'Messenger of the Winds',
            'fr': 'La Messagère du vent',
            'ja': '来訪せし風の御使',
            'ko': '바람의 어사',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 101,
    },
    836: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '避暑离宫马利卡大井',
            'de': 'Malikahs Brunnen',
            'en': 'Malikah\'s Well',
            'fr': 'Le Puits de Malikah',
            'ja': '爽涼離宮 マリカの大井戸',
            'ko': '말리카 큰우물',
        },
        'offsetX': -65,
        'offsetY': -30,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    837: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '遇袭集落水滩村',
            'de': 'Holminster',
            'en': 'Holminster Switch',
            'fr': 'Holminster',
            'ja': '殺戮郷村 ホルミンスター',
            'ko': '홀민스터',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    838: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '末日暗影亚马乌罗提',
            'de': 'Amaurot',
            'en': 'Amaurot',
            'fr': 'Amaurote',
            'ja': '終末幻想 アーモロート',
            'ko': '아모로트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 105,
    },
    840: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '异界遗构希尔科斯孪晶塔',
            'de': 'Der Kristallzwilling',
            'en': 'The Twinning',
            'fr': 'La Macle de Syrcus',
            'ja': '異界遺構 シルクス・ツイニング',
            'ko': '쌍둥이 시르쿠스',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    841: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '创造机构阿尼德罗学院',
            'de': 'Akadaemia Anyder',
            'en': 'Akadaemia Anyder',
            'fr': 'Akadaemia Anydre',
            'ja': '創造機関 アナイダアカデミア',
            'ko': '애나이더 아카데미아',
        },
        'offsetX': 0,
        'offsetY': 30,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    845: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '缇坦妮雅歼灭战',
            'de': 'Offenbarung - Titania',
            'en': 'The Dancing Plague',
            'fr': 'La Valse du Monarque',
            'ja': 'ティターニア討滅戦',
            'ko': '티타니아 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 103,
    },
    846: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '无瑕灵君歼灭战',
            'de': 'Offenbarung - Innozenz',
            'en': 'The Crown of the Immaculate',
            'fr': 'La Couronne de l\'Immaculé',
            'ja': 'イノセンス討滅戦',
            'ko': '이노센스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 104,
    },
    847: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '哈迪斯歼灭战',
            'de': 'Offenbarung - Hades',
            'en': 'The Dying Gasp',
            'fr': 'Le Râle de l\'Agonie',
            'ja': 'ハーデス討滅戦',
            'ko': '하데스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 105,
    },
    848: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '无瑕灵君歼殛战',
            'de': 'Letzte Läuterung - Innozenz',
            'en': 'The Crown of the Immaculate (Extreme)',
            'fr': 'La Couronne de l\'Immaculé (extrême)',
            'ja': '極イノセンス討滅戦',
            'ko': '극 이노센스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 104,
    },
    849: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章1',
            'de': 'Edens Erwachen - Auferstehung',
            'en': 'Eden\'s Gate: Resurrection',
            'fr': 'L\'Éveil d\'Éden - Résurrection',
            'ja': '希望の園エデン：覚醒編1',
            'ko': '희망의 낙원 에덴: 각성편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    850: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章2',
            'de': 'Edens Erwachen - Niederkunft',
            'en': 'Eden\'s Gate: Descent',
            'fr': 'L\'Éveil d\'Éden - Descente',
            'ja': '希望の園エデン：覚醒編2',
            'ko': '희망의 낙원 에덴: 각성편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    851: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章3',
            'de': 'Edens Erwachen - Überflutung',
            'en': 'Eden\'s Gate: Inundation',
            'fr': 'L\'Éveil d\'Éden - Déluge',
            'ja': '希望の園エデン：覚醒編3',
            'ko': '희망의 낙원 에덴: 각성편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    852: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章4',
            'de': 'Edens Erwachen - Beerdigung',
            'en': 'Eden\'s Gate: Sepulture',
            'fr': 'L\'Éveil d\'Éden - Inhumation',
            'ja': '希望の園エデン：覚醒編4',
            'ko': '희망의 낙원 에덴: 각성편 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    853: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章1',
            'de': 'Edens Erwachen - Auferstehung (episch)',
            'en': 'Eden\'s Gate: Resurrection (Savage)',
            'fr': 'L\'Éveil d\'Éden - Résurrection (sadique)',
            'ja': '希望の園エデン零式：覚醒編1',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    854: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章2',
            'de': 'Edens Erwachen - Niederkunft (episch)',
            'en': 'Eden\'s Gate: Descent (Savage)',
            'fr': 'L\'Éveil d\'Éden - Descente (sadique)',
            'ja': '希望の園エデン零式：覚醒編2',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    855: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章3',
            'de': 'Edens Erwachen - Überflutung (episch)',
            'en': 'Eden\'s Gate: Inundation (Savage)',
            'fr': 'L\'Éveil d\'Éden - Déluge (sadique)',
            'ja': '希望の園エデン零式：覚醒編3',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    856: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章4',
            'de': 'Edens Erwachen - Beerdigung (episch)',
            'en': 'Eden\'s Gate: Sepulture (Savage)',
            'fr': 'L\'Éveil d\'Éden - Inhumation (sadique)',
            'ja': '希望の園エデン零式：覚醒編4',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    858: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '缇坦妮雅歼殛战',
            'de': 'Letzte Läuterung - Titania',
            'en': 'The Dancing Plague (Extreme)',
            'fr': 'La Valse du Monarque (extrême)',
            'ja': '極ティターニア討滅戦',
            'ko': '극 티타니아 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 103,
    },
    859: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '机关、诅咒、剧毒与……',
            'de': 'Der Beichtstuhl von Toupasa dem Älteren',
            'en': 'Legend of the Not-so-hidden Temple',
            'fr': 'Le Confessionnal de Toupasa l\'ancien',
            'ja': '仕掛けと呪いと毒と',
            'ko': '함정과 저주와 독',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 102,
    },
    860: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '废都拿巴示艾兰',
            'de': 'Vater und Bruder',
            'en': 'Coming Clean',
            'fr': 'Sur les rails de Nabaath Areng',
            'ja': '廃都ナバスアレン',
            'ko': '나바스아렝 폐허',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 102,
    },
    873: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '摇摆的天平',
            'de': 'Ob Mitleid oder Hass',
            'en': 'The Hardened Heart',
            'fr': 'Naissance d\'un bourreau',
            'ja': '揺れる天秤',
            'ko': '흔들리는 천칭',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    874: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '古代大再生魔法',
            'de': 'Alter Zauber',
            'en': 'The Lost and the Found',
            'fr': 'Magie ancestrale',
            'ja': '古の大再生魔法',
            'ko': '고대의 대재생 마법',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 110,
    },
    875: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '勇敢的猎人',
            'de': 'Der Legende auf der Spur',
            'en': 'The Hunter\'s Legacy',
            'fr': 'La chasseuse de légende',
            'ja': '勇気の狩人',
            'ko': '용기 있는 사냥꾼',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 63,
    },
    876: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '奈贝尔特的后悔',
            'de': 'Ein großes Opfer',
            'en': 'Nyelbert\'s Lament',
            'fr': 'Une cupidité bien généreuse',
            'ja': 'ナイルベルトの後悔',
            'ko': '나일베르트의 후회',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    879: {
        'contentType': 9,
        'exVersion': 3,
        'name': {
            'cn': '梦羽宝境',
            'de': 'Verliese von Lyhe Ghiah',
            'en': 'The Dungeons of Lyhe Ghiah',
            'fr': 'Le Donjon hypogéen du Lyhe Ghiah',
            'ja': '宝物庫 リェー・ギア・ダンジョン',
            'ko': '보물고 리예 기아 지하미궁',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    882: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '复制工厂废墟',
            'de': 'Die kopierte Fabrik',
            'en': 'The Copied Factory',
            'fr': 'La réplique de l\'usine désaffectée',
            'ja': '複製サレタ工場廃墟',
            'ko': '복제된 공장 폐허',
        },
        'offsetX': 610,
        'offsetY': 70,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    884: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '魔法宫殿宇宙宫',
            'de': 'Chateau Cosmea',
            'en': 'The Grand Cosmos',
            'fr': 'Le Cosmos coruscant',
            'ja': '魔法宮殿 グラン・コスモス',
            'ko': '그랑 코스모스',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    885: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '哈迪斯孤念歼灭战',
            'de': 'Letzte Läuterung - Hades',
            'en': 'The Minstrel\'s Ballad: Hades\'s Elegy',
            'fr': 'Le Râle de l\'Agonie (extrême)',
            'ja': '極ハーデス討滅戦',
            'ko': '극 하데스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 105,
    },
    887: {
        'contentType': 28,
        'exVersion': 3,
        'name': {
            'cn': '亚历山大绝境战',
            'de': 'Alexander (fatal)',
            'en': 'The Epic of Alexander (Ultimate)',
            'fr': 'L\'Odyssée d\'Alexander (fatal)',
            'ja': '絶アレキサンダー討滅戦',
            'ko': '절 알렉산더 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    888: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '昂萨哈凯尔（竞争战）',
            'de': 'Onsal Hakair (Danshig Naadam)',
            'en': 'Onsal Hakair (Danshig Naadam)',
            'fr': 'Onsal Hakair (Danshig Naadam)',
            'ja': 'オンサル・ハカイル (終節戦)',
            'ko': '온살 하카이르(계절끝 합전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 117,
    },
    893: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '纯白誓约、漆黑密约',
            'de': 'Der Wolf und der Drachenreiter',
            'en': 'Vows of Virtue, Deeds of Cruelty',
            'fr': 'Vœux de vertu, actes de cruauté',
            'ja': '白き誓約、黒き密約',
            'ko': '하얀 서약, 검은 밀약',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    894: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '我心依旧',
            'de': 'Trubel im Traumland',
            'en': 'As the Heart Bids',
            'fr': 'À l\'écoute de soi',
            'ja': 'この心が望むがままに',
            'ko': '이 마음이 원하는 대로',
        },
        'offsetX': -12,
        'offsetY': 50,
        'sizeFactor': 400,
        'weatherRate': 40,
    },
    897: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '红宝石神兵破坏作战',
            'de': 'Rubinfeuer - Entfesselung',
            'en': 'Cinder Drift',
            'fr': 'Les Nuées de Brandons',
            'ja': 'ルビーウェポン破壊作戦',
            'ko': '루비 웨폰 파괴작전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 28,
    },
    898: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '黑风海底阿尼德罗追忆馆',
            'de': 'Anamnesis Anyder',
            'en': 'Anamnesis Anyder',
            'fr': 'Anamnesis Anydre',
            'ja': '黒風海底 アニドラス・アナムネーシス',
            'ko': '애니드라스 아남네시스',
        },
        'offsetX': 100,
        'offsetY': -390,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    900: {
        'contentType': 16,
        'exVersion': 0,
        'name': {
            'cn': '出海垂钓',
            'de': 'Auf großer Fahrt',
            'en': 'Ocean Fishing',
            'fr': 'Pêche en mer',
            'ja': 'オーシャンフィッシング',
            'ko': '먼바다 낚시',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 14,
    },
    902: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章1',
            'de': 'Edens Resonanz - Entladung',
            'en': 'Eden\'s Verse: Fulmination',
            'fr': 'Les Accords d\'Éden - Fulmination',
            'ja': '希望の園エデン：共鳴編1',
            'ko': '희망의 낙원 에덴: 공명편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    903: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章2',
            'de': 'Edens Resonanz - Raserei',
            'en': 'Eden\'s Verse: Furor',
            'fr': 'Les Accords d\'Éden - Fureur',
            'ja': '希望の園エデン：共鳴編2',
            'ko': '희망의 낙원 에덴: 공명편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    904: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章3',
            'de': 'Edens Resonanz - Bildersturm',
            'en': 'Eden\'s Verse: Iconoclasm',
            'fr': 'Les Accords d\'Éden - Iconoclasme',
            'ja': '希望の園エデン：共鳴編3',
            'ko': '희망의 낙원 에덴: 공명편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    905: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章4',
            'de': 'Edens Resonanz - Erstarrung',
            'en': 'Eden\'s Verse: Refulgence',
            'fr': 'Les Accords d\'Éden - Éclat',
            'ja': '希望の園エデン：共鳴編4',
            'ko': '희망의 낙원 에덴: 공명편 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    906: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章1',
            'de': 'Edens Resonanz - Entladung (episch)',
            'en': 'Eden\'s Verse: Fulmination (Savage)',
            'fr': 'Les Accords d\'Éden - Fulmination (sadique)',
            'ja': '希望の園エデン零式：共鳴編1',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    907: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章2',
            'de': 'Edens Resonanz - Raserei (episch)',
            'en': 'Eden\'s Verse: Furor (Savage)',
            'fr': 'Les Accords d\'Éden - Fureur (sadique)',
            'ja': '希望の園エデン零式：共鳴編2',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    908: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章3',
            'de': 'Edens Resonanz - Bildersturm (episch)',
            'en': 'Eden\'s Verse: Iconoclasm (Savage)',
            'fr': 'Les Accords d\'Éden - Iconoclasme (sadique)',
            'ja': '希望の園エデン零式：共鳴編3',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    909: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章4',
            'de': 'Edens Resonanz - Erstarrung (episch)',
            'en': 'Eden\'s Verse: Refulgence (Savage)',
            'fr': 'Les Accords d\'Éden - Éclat (sadique)',
            'ja': '希望の園エデン零式：共鳴編4',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    911: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '博兹雅堡垒蒸发事件',
            'de': 'Der Bozja-Vorfall',
            'en': 'The Bozja Incident',
            'fr': 'Prélude à la catastrophe',
            'ja': 'シタデル・ボズヤ蒸発事変',
            'ko': '보즈야 사건',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 123,
    },
    912: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '红宝石神兵狂想作战',
            'de': 'Rubinfeuer - Trauma',
            'en': 'Cinder Drift (Extreme)',
            'fr': 'Les Nuées de Brandons (extrême)',
            'ja': '極ルビーウェポン破壊作戦',
            'ko': '극 루비 웨폰 파괴작전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 28,
    },
    913: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '博兹雅堡垒追忆战',
            'de': 'Memoria Misera (extrem)',
            'en': 'Memoria Misera (Extreme)',
            'fr': 'Memoria Misera (extrême)',
            'ja': '極シタデル・ボズヤ追憶戦',
            'ko': '극 보즈야 추억전',
        },
        'offsetX': -35,
        'offsetY': 683,
        'sizeFactor': 400,
        'weatherRate': 123,
    },
    914: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '英雄无法安息',
            'de': 'Von schlafenden Helden',
            'en': 'A Sleep Disturbed',
            'fr': 'L\'épreuve ronka',
            'ja': '汝、英雄の眠り妨げるは',
            'ko': '그대, 영웅의 잠을 방해하는가',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    916: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '暗影决战诺弗兰特',
            'de': 'Schlacht um Norvrandt',
            'en': 'The Heroes\' Gauntlet',
            'fr': 'La Traversée de Norvrandt',
            'ja': '漆黒決戦 ノルヴラント',
            'ko': '노르브란트',
        },
        'offsetX': 626,
        'offsetY': -611,
        'sizeFactor': 200,
        'weatherRate': 125,
    },
    917: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '人偶军事基地',
            'de': 'Die Puppenfestung',
            'en': 'The Puppets\' Bunker',
            'fr': 'La base militaire des Pantins',
            'ja': '人形タチノ軍事基地',
            'ko': '인형들의 군사 기지',
        },
        'offsetX': 290,
        'offsetY': -190,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    920: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'cn': '南方博兹雅战线',
            'de': 'Bozja-Südfront',
            'en': 'The Bozjan Southern Front',
            'fr': 'Front sud de Bozja',
            'ja': '南方ボズヤ戦線',
            'ko': '남부 보즈야 전선',
        },
        'offsetX': -127,
        'offsetY': -424,
        'sizeFactor': 100,
        'weatherRate': 124,
    },
    922: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '光之战士歼灭战',
            'de': 'Krieger des Lichts',
            'en': 'The Seat of Sacrifice',
            'fr': 'Le Trône du Sacrifice',
            'ja': 'ウォーリア・オブ・ライト討滅戦',
            'ko': '빛의 전사 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 125,
    },
    923: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '光之战士幻耀歼灭战',
            'de': 'Krieger des Lichts (extrem)',
            'en': 'The Seat of Sacrifice (Extreme)',
            'fr': 'Le Trône du Sacrifice (extrême)',
            'ja': '極ウォーリア・オブ・ライト討滅戦',
            'ko': '극 빛의 전사 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 126,
    },
    924: {
        'contentType': 9,
        'exVersion': 3,
        'name': {
            'cn': '梦羽宝殿',
            'de': 'Das Karussell von Lyhe Ghiah',
            'en': 'The Shifting Oubliettes of Lyhe Ghiah',
            'fr': 'Le Jardin secret du Lyhe Ghiah',
            'ja': '宝物庫 リェー・ギア・ダンジョン祭殿',
            'ko': '보물고 리예 기아 지하미궁 제전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    925: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '飞翔吧，前往维尔利特！',
            'de': 'Luftangriff auf Werlyt',
            'en': 'Sleep Now in Sapphire',
            'fr': 'Sur la mer de saphir',
            'ja': '飛べ！ ウェルリトへ ',
            'ko': '날아라! 웰리트를 향하여',
        },
        'offsetX': 15,
        'offsetY': -610,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    929: {
        'contentType': 16,
        'exVersion': 1,
        'name': {
            'cn': '天上福地云冠群岛',
            'de': 'Das Diadem - Erschließung',
            'en': 'The Diadem',
            'fr': 'Le Diadème',
            'ja': '雲海採集 ディアデム諸島',
            'ko': '디아뎀 제도',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 68,
    },
    930: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '希瓦幻巧战',
            'de': 'Traumprüfung - Shiva',
            'en': 'The Akh Afah Amphitheatre (Unreal)',
            'fr': 'L\'Amphithéâtre d\'Akh Afah (irréel)',
            'ja': '幻シヴァ討滅戦',
            'ko': '환 시바 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    932: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '褪色的记忆',
            'de': 'Verblasste Erinnerungen',
            'en': 'Faded Memories',
            'fr': 'Souvenir périssable',
            'ja': '色あせた記憶',
            'ko': '빛바랜 기억',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 114,
    },
    933: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '魔术工房玛托雅工作室',
            'de': 'Matoyas Atelier',
            'en': 'Matoya\'s Relict',
            'fr': 'L\'Atelier abandonné de Matoya',
            'ja': '魔術工房 マトーヤのアトリエ',
            'ko': '마토야의 공방',
        },
        'offsetX': 0,
        'offsetY': -75,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    934: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '绿宝石神兵破坏作战',
            'de': 'Smaragdsturm - Entfesselung',
            'en': 'Castrum Marinum',
            'fr': 'Castrum Marinum',
            'ja': 'エメラルドウェポン破壊作戦',
            'ko': '에메랄드 웨폰 파괴작전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    935: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '绿宝石神兵狂想作战',
            'de': 'Smaragdsturm - Trauma',
            'en': 'Castrum Marinum (Extreme)',
            'fr': 'Castrum Marinum (extrême)',
            'ja': '極エメラルドウェポン破壊作戦',
            'ko': '극 에메랄드 웨폰 파괴작전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    936: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'cn': '女王古殿',
            'de': 'Delubrum Reginae',
            'en': 'Delubrum Reginae',
            'fr': 'Delubrum Reginae',
            'ja': 'グンヒルド・ディルーブラム',
        },
        'offsetX': 0,
        'offsetY': -378,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    937: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'cn': '零式女王古殿',
            'de': 'Delubrum Reginae (episch)',
            'en': 'Delubrum Reginae (Savage)',
            'fr': 'Delubrum Reginae (sadique)',
            'ja': 'グンヒルド・ディルーブラム零式',
        },
        'offsetX': 0,
        'offsetY': -378,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    938: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'de': 'Die Goldene Ebene von Paglth\'an',
            'en': 'Paglth\'an',
            'fr': 'La grande prairie de Paglth\'an',
            'ja': '黄金平原 パガルザン',
        },
        'offsetX': 415,
        'offsetY': -110,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    940: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '九宫幻卡：官方锦标赛',
            'de': 'Triple Triad: Manderville-Turnier',
            'en': 'Triple Triad Open Tournament',
            'fr': 'Tournoi officiel de Triple Triade',
            'ja': 'トリプルトライアド：オフィシャルトーナメント',
            'ko': '트리플 트라이어드: 공식 토너먼트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 800,
        'weatherRate': 0,
    },
    941: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '九宫幻卡：锦标赛对局室',
            'de': 'Triple Triad: Privatturnier',
            'en': 'Triple Triad Invitational Parlor',
            'fr': 'Salle de tournoi libre de Triple Triade',
            'ja': 'トリプルトライアド：カスタムトーナメントルーム',
            'ko': '트리플 트라이어드: 친선 토너먼트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 800,
        'weatherRate': 0,
    },
    942: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章1',
            'de': 'Edens Verheißung - Umbra',
            'en': 'Eden\'s Promise: Umbra',
            'fr': 'La Promesse d\'Éden - Nuée',
            'ja': '希望の園エデン：再生編1',
            'ko': '희망의 낙원 에덴: 재생편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    943: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章2',
            'de': 'Edens Verheißung - Litanei',
            'en': 'Eden\'s Promise: Litany',
            'fr': 'La Promesse d\'Éden - Litanie',
            'ja': '希望の園エデン：再生編2',
            'ko': '희망의 낙원 에덴: 재생편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    944: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章3',
            'de': 'Edens Verheißung - Anamorphose',
            'en': 'Eden\'s Promise: Anamorphosis',
            'fr': 'La Promesse d\'Éden - Anamorphose',
            'ja': '希望の園エデン：再生編3',
            'ko': '희망의 낙원 에덴: 재생편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    945: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章4',
            'de': 'Edens Verheißung - Ewigkeit',
            'en': 'Eden\'s Promise: Eternity',
            'fr': 'La Promesse d\'Éden - Éternité',
            'ja': '希望の園エデン：再生編4',
            'ko': '희망의 낙원 에덴: 재생편 4',
        },
        'offsetX': -71,
        'offsetY': 23,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    946: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章1',
            'de': 'Edens Verheißung - Umbra (episch)',
            'en': 'Eden\'s Promise: Umbra (Savage)',
            'fr': 'La Promesse d\'Éden - Nuée (sadique)',
            'ja': '希望の園エデン零式：再生編1',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    947: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章2',
            'de': 'Edens Verheißung - Litanei (episch)',
            'en': 'Eden\'s Promise: Litany (Savage)',
            'fr': 'La Promesse d\'Éden - Litanie (sadique)',
            'ja': '希望の園エデン零式：再生編2',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    948: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章3',
            'de': 'Edens Verheißung - Anamorphose (episch)',
            'en': 'Eden\'s Promise: Anamorphosis (Savage)',
            'fr': 'La Promesse d\'Éden - Anamorphose (sadique)',
            'ja': '希望の園エデン零式：再生編3',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    949: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章4',
            'de': 'Edens Verheißung - Ewigkeit (episch)',
            'en': 'Eden\'s Promise: Eternity (Savage)',
            'fr': 'La Promesse d\'Éden - Éternité (sadique)',
            'ja': '希望の園エデン零式：再生編4',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 75,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    950: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'de': 'Diamantblitz - Entfesselung',
            'en': 'The Cloud Deck',
            'fr': 'Le Tillac des Cirrus',
            'ja': 'ダイヤウェポン捕獲作戦',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    951: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'de': 'Diamantblitz - Trauma',
            'en': 'The Cloud Deck (Extreme)',
            'fr': 'Le Tillac des Cirrus (extrême)',
            'ja': '極ダイヤウェポン捕獲作戦',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    953: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '泰坦幻巧战',
            'de': 'Traumprüfung - Titan',
            'en': 'The Navel (Unreal)',
            'fr': 'Le Nombril (irréel)',
            'ja': '幻タイタン討滅戦',
            'ko': '환 타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    954: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '威尔布兰德扬帆起航',
            'de': 'Gute Winde für Vylbrand',
            'en': 'The Great Ship Vylbrand',
            'fr': 'Un navire nommé Vylbrand',
            'ja': 'バイルブランドの船出',
            'ko': '바일브랜드 출항',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    955: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '神佑女王',
            'de': 'Hinab in die Ruinen',
            'en': 'Fit for a Queen',
            'fr': 'Que les Dieux gardent la Reine',
            'ja': 'ゴッド・セイブ・ザ・クイーン',
        },
        'offsetX': 0,
        'offsetY': -750,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    966: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'de': 'Der Turm, Paradigmenbrecher',
            'en': 'The Tower at Paradigm\'s Breach',
            'fr': 'La tour de la Contingence',
            'ja': '希望ノ砲台：「塔」',
        },
        'offsetX': 808,
        'offsetY': -772,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    967: {
        'exVersion': 3,
        'name': {
            'cn': '帝国海上基地干船坞',
            'de': 'Trockendock von Castrum Marinum',
            'en': 'Castrum Marinum Drydocks',
            'fr': 'Cale sèche de Castrum Marinum',
            'ja': 'カステッルム・マリヌム・ドライドック',
            'ko': '카스트룸 마리눔 건선거',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    972: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'de': 'Traumprüfung - Leviathan',
            'en': 'The <Emphasis>Whorleater</Emphasis> (Unreal)',
            'fr': 'Le Briseur de marées (irréel)',
            'ja': '幻リヴァイアサン討滅戦',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    975: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'de': 'Zadnor-Hochebene',
            'en': 'Zadnor',
            'fr': 'Hauts plateaux de Zadnor',
            'ja': 'ザトゥノル高原',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 130,
    },
    977: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'de': 'Kampf im Morgengrauen',
            'en': 'Death Unto Dawn',
            'fr': 'Aube meurtrière',
            'ja': '黎明の死闘',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 114,
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			7: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcactbot"] = self["webpackChunkcactbot"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [890,727], () => (__webpack_require__(687)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;