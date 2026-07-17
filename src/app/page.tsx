"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { questions } from "@/lib/assessment";
import { calculateProfile, type AnswerMap } from "@/lib/scoring";
import {
  SESSION_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  UPDATE_STORAGE_KEY,
  clampStoredIndex,
  defaultAvatarConfig,
  normalizeAppView,
  normalizeAvatarConfig,
  sanitizeCoreAnswers,
  sanitizeSideAnswers,
  type AppView,
  type AvatarConfig,
  type Gender
} from "@/lib/app-core";
import {
  calculateEngagementResult,
  calculateLeadershipStyleResult,
  engagementQuestions,
  leadershipStyleQuestions,
  type SideAnswerMap,
  type SideQuestId
} from "@/lib/side-assessments";
import {
  belbinSections,
  calculateBelbinResult,
  countCompletedBelbinSections,
  isBelbinSectionComplete,
  sanitizeBelbinAnswers,
  type BelbinAnswers,
  type BelbinSectionId,
  type BelbinSectionScores
} from "@/lib/belbin-assessment";
import {
  calculateLeadershipPotentialResult,
  leadershipPotentialQuestions,
  sanitizeLeadershipPotentialAnswers,
  type LeadershipPotentialAnswers,
  type LeadershipPotentialCode
} from "@/lib/leadership-potential";
import { AppOverlays } from "@/components/app-overlays";
import { StartScreen } from "@/components/start-screen";
import { QuestHubScreen } from "@/components/quest-hub-screen";
import { QuestScreen } from "@/components/quest-screen";
import { ResultScreen } from "@/components/result-screen";
import {
  SideAssessmentResultScreen,
  SideAssessmentScreen
} from "@/components/side-assessment-screens";
import {
  LeadershipPotentialResultScreen,
  LeadershipPotentialScreen
} from "@/components/leadership-potential-screens";
import {
  BelbinAssessmentScreen,
  BelbinResultScreen
} from "@/components/belbin-screens";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appView, setAppView] = useState<AppView>("registration");
  const [showResult, setShowResult] = useState(false);
  const [sideAnswers, setSideAnswers] = useState<Record<SideQuestId, SideAnswerMap>>({
    engagement: {},
    leadershipStyle: {}
  });
  const [sideCurrentIndex, setSideCurrentIndex] = useState<Record<SideQuestId, number>>({
    engagement: 0,
    leadershipStyle: 0
  });
  const [sideShowResult, setSideShowResult] = useState<Record<SideQuestId, boolean>>({
    engagement: false,
    leadershipStyle: false
  });
  const [belbinAnswers, setBelbinAnswers] = useState<BelbinAnswers>({});
  const [belbinCurrentIndex, setBelbinCurrentIndex] = useState(0);
  const [belbinShowResult, setBelbinShowResult] = useState(false);
  const [leadershipPotentialAnswers, setLeadershipPotentialAnswers] =
    useState<LeadershipPotentialAnswers>({});
  const [leadershipPotentialIndex, setLeadershipPotentialIndex] = useState(0);
  const [leadershipPotentialShowResult, setLeadershipPotentialShowResult] =
    useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const navigationGeneration = useRef(0);

  const profile = useMemo(() => calculateProfile(answers), [answers]);
  const currentQuestion = questions[currentIndex] ?? questions[0];
  const isComplete = profile.answeredCount === questions.length;

  useEffect(() => {
    // Keep progress across refreshes, but start fresh after the browser tab is closed.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw) as {
          playerName?: string;
          answers?: AnswerMap;
          currentIndex?: number;
          started?: boolean;
          appView?: AppView;
          showResult?: boolean;
          gender?: Gender;
          avatarConfig?: Partial<AvatarConfig>;
          sideAnswers?: Partial<Record<SideQuestId, SideAnswerMap>>;
          sideCurrentIndex?: Partial<Record<SideQuestId, number>>;
          sideShowResult?: Partial<Record<SideQuestId, boolean>>;
          belbinAnswers?: BelbinAnswers;
          belbinCurrentIndex?: number;
          belbinShowResult?: boolean;
          leadershipPotentialAnswers?: LeadershipPotentialAnswers;
          leadershipPotentialIndex?: number;
          leadershipPotentialShowResult?: boolean;
        };
        setPlayerName(
          typeof saved.playerName === "string" ? saved.playerName.slice(0, 28) : ""
        );
        setAnswers(sanitizeCoreAnswers(saved.answers));
        setCurrentIndex(clampStoredIndex(saved.currentIndex, questions.length));
        setAppView(normalizeAppView(saved.appView, saved.started));
        setShowResult(Boolean(saved.showResult));
        setGender(
          saved.gender === "male" || saved.gender === "female"
            ? saved.gender
            : saved.avatarConfig?.bodyType === "male" || saved.avatarConfig?.bodyType === "female"
              ? saved.avatarConfig.bodyType
              : null
        );
        setAvatarConfig(normalizeAvatarConfig(saved.avatarConfig));
        setSideAnswers({
          engagement: sanitizeSideAnswers(saved.sideAnswers?.engagement, "engagement"),
          leadershipStyle: sanitizeSideAnswers(
            saved.sideAnswers?.leadershipStyle,
            "leadershipStyle"
          )
        });
        setSideCurrentIndex({
          engagement: clampStoredIndex(
            saved.sideCurrentIndex?.engagement,
            engagementQuestions.length
          ),
          leadershipStyle: clampStoredIndex(
            saved.sideCurrentIndex?.leadershipStyle,
            leadershipStyleQuestions.length
          )
        });
        setSideShowResult({
          engagement: Boolean(saved.sideShowResult?.engagement),
          leadershipStyle: Boolean(saved.sideShowResult?.leadershipStyle)
        });
        setBelbinAnswers(sanitizeBelbinAnswers(saved.belbinAnswers));
        setBelbinCurrentIndex(
          clampStoredIndex(saved.belbinCurrentIndex, belbinSections.length)
        );
        setBelbinShowResult(Boolean(saved.belbinShowResult));
        setLeadershipPotentialAnswers(
          sanitizeLeadershipPotentialAnswers(saved.leadershipPotentialAnswers)
        );
        setLeadershipPotentialIndex(
          clampStoredIndex(
            saved.leadershipPotentialIndex,
            leadershipPotentialQuestions.length
          )
        );
        setLeadershipPotentialShowResult(
          Boolean(saved.leadershipPotentialShowResult)
        );
      } catch {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setShowUpdate(window.localStorage.getItem(UPDATE_STORAGE_KEY) !== "seen");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        playerName,
        gender,
        answers,
        currentIndex,
        appView,
        showResult,
        avatarConfig,
        sideAnswers,
        sideCurrentIndex,
        sideShowResult,
        belbinAnswers,
        belbinCurrentIndex,
        belbinShowResult,
        leadershipPotentialAnswers,
        leadershipPotentialIndex,
        leadershipPotentialShowResult
      })
    );
  }, [
    answers,
    appView,
    avatarConfig,
    belbinAnswers,
    belbinCurrentIndex,
    belbinShowResult,
    currentIndex,
    gender,
    hydrated,
    playerName,
    leadershipPotentialAnswers,
    leadershipPotentialIndex,
    leadershipPotentialShowResult,
    showResult,
    sideAnswers,
    sideCurrentIndex,
    sideShowResult
  ]);

  function beginQuest() {
    if (!playerName.trim() || !gender) return;
    navigationGeneration.current += 1;
    setAppView("hub");
  }

  function startCoreQuest() {
    navigationGeneration.current += 1;
    setAppView("core");
    setShowResult(isComplete);
    if (Object.keys(answers).length === 0) setCurrentIndex(0);
  }

  function restart() {
    navigationGeneration.current += 1;
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
    setAppView("registration");
    setPlayerName("");
    setGender(null);
    setAvatarConfig(defaultAvatarConfig);
    setSideAnswers({ engagement: {}, leadershipStyle: {} });
    setSideCurrentIndex({ engagement: 0, leadershipStyle: 0 });
    setSideShowResult({ engagement: false, leadershipStyle: false });
    setBelbinAnswers({});
    setBelbinCurrentIndex(0);
    setBelbinShowResult(false);
    setLeadershipPotentialAnswers({});
    setLeadershipPotentialIndex(0);
    setLeadershipPotentialShowResult(false);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  function answerCurrent(value: number) {
    const answeredIndex = currentIndex;
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    const generation = ++navigationGeneration.current;
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (navigationGeneration.current !== generation) return;
      if (answeredIndex === questions.length - 1) {
        if (Object.keys(nextAnswers).length === questions.length) {
          setShowResult(true);
        }
        return;
      }

      setCurrentIndex((index) => (index === answeredIndex ? index + 1 : index));
    }, 170);
  }

  function goPrevious() {
    navigationGeneration.current += 1;
    setShowResult(false);
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    navigationGeneration.current += 1;
    if (currentIndex === questions.length - 1) {
      if (isComplete) setShowResult(true);
      return;
    }
    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
  }

  function sideQuestionCount(questId: SideQuestId) {
    return questId === "engagement" ? engagementQuestions.length : leadershipStyleQuestions.length;
  }

  function answerSideQuestion(questId: SideQuestId, questionId: number, value: number) {
    const answeredIndex = sideCurrentIndex[questId];
    const nextAnswers = { ...sideAnswers[questId], [questionId]: value };
    const total = sideQuestionCount(questId);
    const generation = ++navigationGeneration.current;

    setSideAnswers((current) => ({ ...current, [questId]: nextAnswers }));

    window.setTimeout(() => {
      if (navigationGeneration.current !== generation) return;
      if (answeredIndex === total - 1) {
        if (Object.keys(nextAnswers).length === total) {
          setSideShowResult((current) => ({ ...current, [questId]: true }));
        }
        return;
      }

      setSideCurrentIndex((current) => ({
        ...current,
        [questId]: current[questId] === answeredIndex ? answeredIndex + 1 : current[questId]
      }));
    }, 170);
  }

  function goSidePrevious(questId: SideQuestId) {
    navigationGeneration.current += 1;
    setSideShowResult((current) => ({ ...current, [questId]: false }));
    setSideCurrentIndex((current) => ({
      ...current,
      [questId]: Math.max(0, current[questId] - 1)
    }));
  }

  function goSideNext(questId: SideQuestId) {
    navigationGeneration.current += 1;
    const total = sideQuestionCount(questId);
    const index = sideCurrentIndex[questId];
    if (index === total - 1) {
      if (Object.keys(sideAnswers[questId]).length === total) {
        setSideShowResult((current) => ({ ...current, [questId]: true }));
      }
      return;
    }
    setSideCurrentIndex((current) => ({
      ...current,
      [questId]: Math.min(total - 1, current[questId] + 1)
    }));
  }

  function restartSideQuest(questId: SideQuestId) {
    navigationGeneration.current += 1;
    setSideAnswers((current) => ({ ...current, [questId]: {} }));
    setSideCurrentIndex((current) => ({ ...current, [questId]: 0 }));
    setSideShowResult((current) => ({ ...current, [questId]: false }));
  }

  function updateBelbinSection(
    sectionId: BelbinSectionId,
    scores: BelbinSectionScores
  ) {
    setBelbinAnswers((current) => ({ ...current, [sectionId]: scores }));
  }

  function goBelbinPrevious() {
    navigationGeneration.current += 1;
    setBelbinShowResult(false);
    setBelbinCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goBelbinNext() {
    navigationGeneration.current += 1;
    const section = belbinSections[belbinCurrentIndex];
    if (!isBelbinSectionComplete(belbinAnswers[section.id])) return;

    if (belbinCurrentIndex === belbinSections.length - 1) {
      if (countCompletedBelbinSections(belbinAnswers) === belbinSections.length) {
        setBelbinShowResult(true);
      }
      return;
    }

    setBelbinCurrentIndex((index) => Math.min(belbinSections.length - 1, index + 1));
  }

  function restartBelbin() {
    navigationGeneration.current += 1;
    setBelbinAnswers({});
    setBelbinCurrentIndex(0);
    setBelbinShowResult(false);
  }

  function answerLeadershipPotential(
    questionId: number,
    code: LeadershipPotentialCode
  ) {
    const answeredIndex = leadershipPotentialIndex;
    const nextAnswers = {
      ...leadershipPotentialAnswers,
      [questionId]: code
    };
    const generation = ++navigationGeneration.current;
    setLeadershipPotentialAnswers(nextAnswers);

    window.setTimeout(() => {
      if (navigationGeneration.current !== generation) return;
      if (answeredIndex === leadershipPotentialQuestions.length - 1) {
        if (Object.keys(nextAnswers).length === leadershipPotentialQuestions.length) {
          setLeadershipPotentialShowResult(true);
        }
        return;
      }
      setLeadershipPotentialIndex((index) =>
        index === answeredIndex ? index + 1 : index
      );
    }, 170);
  }

  function goLeadershipPotentialPrevious() {
    navigationGeneration.current += 1;
    setLeadershipPotentialShowResult(false);
    setLeadershipPotentialIndex((index) => Math.max(0, index - 1));
  }

  function goLeadershipPotentialNext() {
    navigationGeneration.current += 1;
    if (leadershipPotentialIndex === leadershipPotentialQuestions.length - 1) {
      if (
        Object.keys(leadershipPotentialAnswers).length ===
        leadershipPotentialQuestions.length
      ) {
        setLeadershipPotentialShowResult(true);
      }
      return;
    }
    setLeadershipPotentialIndex((index) =>
      Math.min(leadershipPotentialQuestions.length - 1, index + 1)
    );
  }

  function restartLeadershipPotential() {
    navigationGeneration.current += 1;
    setLeadershipPotentialAnswers({});
    setLeadershipPotentialIndex(0);
    setLeadershipPotentialShowResult(false);
  }

  function backToQuestHub() {
    navigationGeneration.current += 1;
    setAppView("hub");
  }

  function closeUpdate() {
    window.localStorage.setItem(UPDATE_STORAGE_KEY, "seen");
    setShowUpdate(false);
  }

  const appOverlays = (
    <AppOverlays
      showUpdate={showUpdate}
      onOpenUpdate={() => setShowUpdate(true)}
      onCloseUpdate={closeUpdate}
    />
  );

  if (!hydrated) {
    return <main className="quest-shell min-h-svh" />;
  }

  if (appView === "registration") {
    return (
      <>
        <main className="quest-shell flex min-h-svh items-center px-4 py-6 sm:px-6 lg:px-10">
          <StartScreen
            playerName={playerName}
            setPlayerName={setPlayerName}
            gender={gender}
            setGender={(nextGender) => {
              setGender(nextGender);
              setAvatarConfig((config) => ({ ...config, bodyType: nextGender }));
            }}
            onStart={beginQuest}
          />
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "hub") {
    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-6 sm:px-6 lg:px-10">
          <QuestHubScreen
            playerName={playerName}
            gender={gender}
            coreAnswered={profile.answeredCount}
            engagementAnswered={Object.keys(sideAnswers.engagement).length}
            leadershipAnswered={Object.keys(sideAnswers.leadershipStyle).length}
            belbinCompleted={countCompletedBelbinSections(belbinAnswers)}
            leadershipPotentialAnswered={
              Object.keys(leadershipPotentialAnswers).length
            }
            onSelect={(questId) => {
              if (questId === "core") {
                startCoreQuest();
              } else if (questId === "belbin") {
                if (countCompletedBelbinSections(belbinAnswers) === belbinSections.length) {
                  setBelbinShowResult(true);
                }
                setAppView("belbin");
              } else if (questId === "leadershipPotential") {
                if (
                  Object.keys(leadershipPotentialAnswers).length ===
                  leadershipPotentialQuestions.length
                ) {
                  setLeadershipPotentialShowResult(true);
                }
                setAppView("leadershipPotential");
              } else {
                if (Object.keys(sideAnswers[questId]).length === sideQuestionCount(questId)) {
                  setSideShowResult((current) => ({ ...current, [questId]: true }));
                }
                setAppView(questId);
              }
            }}
            onReset={restart}
          />
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "leadershipPotential") {
    const result = calculateLeadershipPotentialResult(
      leadershipPotentialAnswers
    );

    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
          {leadershipPotentialShowResult && result ? (
            <LeadershipPotentialResultScreen
              playerName={playerName}
              result={result}
              onBackToAnswers={() => {
                navigationGeneration.current += 1;
                setLeadershipPotentialShowResult(false);
                setLeadershipPotentialIndex(
                  leadershipPotentialQuestions.length - 1
                );
              }}
              onBackToHub={backToQuestHub}
              onRestart={restartLeadershipPotential}
            />
          ) : (
            <LeadershipPotentialScreen
              playerName={playerName}
              gender={gender}
              answers={leadershipPotentialAnswers}
              currentIndex={leadershipPotentialIndex}
              onAnswer={answerLeadershipPotential}
              onPrevious={goLeadershipPotentialPrevious}
              onNext={goLeadershipPotentialNext}
              onBackToHub={backToQuestHub}
              onRestart={restartLeadershipPotential}
            />
          )}
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "belbin") {
    const result = calculateBelbinResult(belbinAnswers);

    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
          {belbinShowResult && result ? (
            <BelbinResultScreen
              playerName={playerName}
              result={result}
              onBackToAnswers={() => {
                navigationGeneration.current += 1;
                setBelbinShowResult(false);
                setBelbinCurrentIndex(belbinSections.length - 1);
              }}
              onBackToHub={backToQuestHub}
              onRestart={restartBelbin}
            />
          ) : (
            <BelbinAssessmentScreen
              playerName={playerName}
              gender={gender}
              answers={belbinAnswers}
              currentIndex={belbinCurrentIndex}
              onChange={updateBelbinSection}
              onPrevious={goBelbinPrevious}
              onNext={goBelbinNext}
              onBackToHub={backToQuestHub}
              onRestart={restartBelbin}
            />
          )}
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "engagement" || appView === "leadershipStyle") {
    const questId = appView;
    const result =
      questId === "engagement"
        ? calculateEngagementResult(sideAnswers[questId])
        : calculateLeadershipStyleResult(sideAnswers[questId]);

    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
          {sideShowResult[questId] && result ? (
            <SideAssessmentResultScreen
              questId={questId}
              playerName={playerName}
              result={result}
              onBackToAnswers={() => {
                navigationGeneration.current += 1;
                setSideShowResult((current) => ({ ...current, [questId]: false }));
                setSideCurrentIndex((current) => ({
                  ...current,
                  [questId]: sideQuestionCount(questId) - 1
                }));
              }}
              onBackToHub={backToQuestHub}
              onRestart={() => restartSideQuest(questId)}
            />
          ) : (
            <SideAssessmentScreen
              questId={questId}
              playerName={playerName}
              gender={gender}
              answers={sideAnswers[questId]}
              currentIndex={sideCurrentIndex[questId]}
              onAnswer={(questionId, value) => answerSideQuestion(questId, questionId, value)}
              onPrevious={() => goSidePrevious(questId)}
              onNext={() => goSideNext(questId)}
              onBackToHub={backToQuestHub}
              onRestart={() => restartSideQuest(questId)}
            />
          )}
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "core" && showResult && isComplete) {
    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-6 sm:px-6 lg:px-10">
          <ResultScreen
            playerName={playerName}
            gender={gender}
            avatarConfig={avatarConfig}
            answers={answers}
            profile={profile}
            onRestart={restart}
            onBackToHub={backToQuestHub}
            onBack={() => {
              navigationGeneration.current += 1;
              setShowResult(false);
              setCurrentIndex(questions.length - 1);
            }}
          />
        </main>
        {appOverlays}
      </>
    );
  }

  return (
    <>
      <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
        <QuestScreen
          answers={answers}
          currentQuestion={currentQuestion}
          currentIndex={currentIndex}
          playerName={playerName}
          gender={gender}
          profile={profile}
          onAnswer={answerCurrent}
          onNext={goNext}
          onPrevious={goPrevious}
          onRestart={restart}
          onBackToHub={backToQuestHub}
        />
      </main>
      {appOverlays}
    </>
  );
}
