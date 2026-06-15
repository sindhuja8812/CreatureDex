import { useState, useCallback } from 'react';
import { Swords, RotateCcw, Zap, Cpu, Sword, Sparkles, Shield, Dices, Trophy, Skull, Star, AlertTriangle } from 'lucide-react';
import type { Creature } from '../utils/creatureGenerator';
import { RARITY_COLORS } from '../utils/creatureGenerator';
import { initBattle, resolveTurn, PLAYER_MOVES } from '../utils/battleEngine';
import type { BattleState, Move } from '../utils/battleEngine';
import CreatureArt from '../components/CreatureArt';

interface Props {
  collection: Creature[];
}

const MOVE_ICONS: Record<string, React.ReactNode> = {
  sword: <Sword size={18} />,
  sparkles: <Sparkles size={18} />,
  shield: <Shield size={18} />,
  dices: <Dices size={18} />,
};

const LOG_ICONS: Record<string, React.ReactNode> = {
  '[SWORD]': <Sword size={10} className="flex-shrink-0 mt-0.5" />,
  '[SPECIAL]': <Sparkles size={10} className="flex-shrink-0 mt-0.5 text-purple-400" />,
  '[SHIELD]': <Shield size={10} className="flex-shrink-0 mt-0.5 text-blue-400" />,
  '[MISS]': <AlertTriangle size={10} className="flex-shrink-0 mt-0.5 text-gray-400" />,
  '[CRIT]': <Star size={10} className="flex-shrink-0 mt-0.5 text-amber-400" />,
  '[WILD]': <Dices size={10} className="flex-shrink-0 mt-0.5" />,
};

type BattlePhaseAnim = 'idle' | 'player-attack' | 'cpu-thinking' | 'cpu-attack' | 'result';

function parseMessage(msg: string) {
  const tag = Object.keys(LOG_ICONS).find(t => msg.startsWith(t));
  if (!tag) return { icon: null, text: msg };
  return { icon: LOG_ICONS[tag], text: msg.replace(tag, '').trim() };
}

function DamageFloat({ damage, isPlayer }: { damage: number; isPlayer: boolean }) {
  if (damage === 0) return (
    <div className={`damage-float miss ${isPlayer ? 'player-side' : 'cpu-side'}`}>MISS</div>
  );
  return (
    <div className={`damage-float ${isPlayer ? 'player-side' : 'cpu-side'} ${damage > 40 ? 'crit' : ''}`}>
      -{damage}
    </div>
  );
}

function HpBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">HP</span>
        <span className="text-gray-300 font-mono">{hp} / {maxHp}</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SpBar({ sp }: { sp: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-xs text-gray-500">SP</span>
      {[0, 1, 2].map(i => (
        <div key={i} className="w-4 h-4 rounded-sm border transition-all duration-300"
          style={{
            backgroundColor: i < sp ? '#a855f7' : 'transparent',
            borderColor: i < sp ? '#a855f7' : '#374151',
          }} />
      ))}
    </div>
  );
}

function FighterPanel({ fighter, isPlayer, isDefending, animPhase, showDamage }: {
  fighter: BattleState['player'];
  isPlayer: boolean;
  isDefending: boolean;
  animPhase: BattlePhaseAnim;
  showDamage: number | null;
}) {
  const color = RARITY_COLORS[fighter.creature.rarity];
  const isAttacking = isPlayer
    ? animPhase === 'player-attack'
    : animPhase === 'cpu-attack';
  const isReceiving = isPlayer
    ? animPhase === 'cpu-attack'
    : animPhase === 'player-attack';

  return (
    <div className={`fighter-panel ${isAttacking ? 'fighter-attacking' : ''} ${isReceiving ? 'fighter-hit' : ''}`}
      style={{ borderColor: `${color}30` }}>
      <div className="flex items-center gap-2 mb-2">
        {isPlayer
          ? <Zap size={12} className="text-amber-400" />
          : <Cpu size={12} className="text-red-400" />}
        <span className="text-xs font-bold" style={{ color: isPlayer ? '#f59e0b' : '#ef4444' }}>
          {isPlayer ? 'YOU' : 'CPU'}
        </span>
        {isDefending && (
          <span className="flex items-center gap-1 text-xs text-blue-400 ml-auto">
            <Shield size={10} /> Defending
          </span>
        )}
      </div>

      <div className="fighter-art-sm relative">
        <CreatureArt species={fighter.creature.species} rarity={fighter.creature.rarity} />
        {showDamage !== null && (
          <DamageFloat damage={showDamage} isPlayer={isPlayer} />
        )}
      </div>

      <p className="text-xs font-bold text-gray-100 text-center mt-2 truncate">
        {fighter.creature.name.split(',')[0]}
      </p>
      <p className="text-xs text-center mb-2" style={{ color }}>{fighter.creature.rarity}</p>
      <HpBar hp={fighter.hp} maxHp={fighter.maxHp} />
      {isPlayer && <SpBar sp={fighter.sp} />}
    </div>
  );
}

function CpuThinking() {
  return (
    <div className="cpu-thinking">
      <Cpu size={14} className="text-red-400" />
      <span className="text-red-400 text-xs font-bold">CPU is thinking</span>
      <div className="thinking-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

function PhaseStatus({ phase, lastResult }: {
  phase: BattlePhaseAnim;
  lastResult: BattleState['logs'][0] | null;
}) {
  if (phase === 'player-attack' && lastResult) {
    const { text } = parseMessage(lastResult.playerMessage);
    return (
      <div className="phase-status player-phase">
        <Sword size={14} className="flex-shrink-0" />
        <span>{text}</span>
      </div>
    );
  }
  if (phase === 'cpu-thinking') return <CpuThinking />;
  if (phase === 'cpu-attack' && lastResult) {
    const { text } = parseMessage(lastResult.cpuMessage);
    return (
      <div className="phase-status cpu-phase">
        <Cpu size={14} className="flex-shrink-0" />
        <span>{text}</span>
      </div>
    );
  }
  if (phase === 'result') return (
    <div className="phase-status result-phase">
      <span>Your turn — choose a move!</span>
    </div>
  );
  return null;
}

export default function BattlePage({ collection }: Props) {
  const [playerCreature, setPlayerCreature] = useState<Creature | null>(null);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [lastResult, setLastResult] = useState<BattleState['logs'][0] | null>(null);
  const [phase, setPhase] = useState<'pick' | 'battle'>('pick');
  const [animPhase, setAnimPhase] = useState<BattlePhaseAnim>('idle');
  const [showPlayerDamage, setShowPlayerDamage] = useState<number | null>(null);
  const [showCpuDamage, setShowCpuDamage] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePickCreature = useCallback((creature: Creature) => {
    setPlayerCreature(creature);
  }, []);

  const handleStartBattle = useCallback(() => {
    if (!playerCreature) return;
    const available = collection.filter(c => c.id !== playerCreature.id);
    const cpuCreature = available[Math.floor(Math.random() * available.length)];
    setBattle(initBattle(playerCreature, cpuCreature));
    setLastResult(null);
    setAnimPhase('idle');
    setPhase('battle');
  }, [playerCreature, collection]);

  const handleMove = useCallback(async (move: Move) => {
    if (!battle || battle.winner || isAnimating) return;
    setIsAnimating(true);

    const newState = resolveTurn(battle, move);
    const result = newState.logs[newState.logs.length - 1];
    const playerGoesFirst = newState.playerWentFirst;

    if (playerGoesFirst) {
      // Phase 1: Player attacks
      setAnimPhase('player-attack');
      setLastResult(result);
      await new Promise(r => setTimeout(r, 1200));

      // Show player damage on CPU
      setShowCpuDamage(result.playerDamage);
      setBattle(newState);
      await new Promise(r => setTimeout(r, 800));
      setShowCpuDamage(null);

      // If CPU died, stop here
      if (newState.cpu.hp <= 0) {
        setAnimPhase('idle');
        setIsAnimating(false);
        return;
      }

      // Phase 2: CPU thinking
      setAnimPhase('cpu-thinking');
      await new Promise(r => setTimeout(r, 1000));

      // Phase 3: CPU attacks
      setAnimPhase('cpu-attack');
      await new Promise(r => setTimeout(r, 1200));

      // Show CPU damage on player
      setShowPlayerDamage(result.cpuDamage);
      await new Promise(r => setTimeout(r, 800));
      setShowPlayerDamage(null);

    } else {
      // CPU goes first
      setAnimPhase('cpu-thinking');
      setLastResult(result);
      await new Promise(r => setTimeout(r, 1000));

      // Phase: CPU attacks
      setAnimPhase('cpu-attack');
      await new Promise(r => setTimeout(r, 1200));

      // Show CPU damage on player
      setShowPlayerDamage(result.cpuDamage);
      setBattle(newState);
      await new Promise(r => setTimeout(r, 800));
      setShowPlayerDamage(null);

      // If player died, stop here
      if (newState.player.hp <= 0) {
        setAnimPhase('idle');
        setIsAnimating(false);
        return;
      }

      // Phase: Player attacks
      setAnimPhase('player-attack');
      await new Promise(r => setTimeout(r, 1200));

      // Show player damage on CPU
      setShowCpuDamage(result.playerDamage);
      await new Promise(r => setTimeout(r, 800));
      setShowCpuDamage(null);
    }

    // Final phase
    setAnimPhase(newState.winner ? 'idle' : 'result');
    setIsAnimating(false);
  }, [battle, isAnimating]);

  const handleReset = useCallback(() => {
    setBattle(null);
    setLastResult(null);
    setPhase('pick');
    setPlayerCreature(null);
    setAnimPhase('idle');
    setIsAnimating(false);
  }, []);

  if (collection.length < 2) {
    return (
      <div className="empty-state mt-12">
        <Swords size={48} className="text-gray-600 mb-3" />
        <p className="text-gray-400 font-semibold">Need at least 2 creatures</p>
        <p className="text-gray-500 text-sm mt-1">Go generate and save some creatures first!</p>
      </div>
    );
  }

  return (
    <div className="battle-page">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-red-400">Battle</span>
          <span className="text-gray-200"> Arena</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {phase === 'pick' ? 'Choose your fighter!' : 'Choose your move!'}
        </p>
      </div>

      {phase === 'pick' ? (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
            Your Fighter
          </p>
          <div className="creature-pick-grid">
            {collection.map(c => (
              <button
                key={c.id}
                onClick={() => handlePickCreature(c)}
                className={`creature-pick-btn ${playerCreature?.id === c.id ? 'active' : ''}`}
                style={{ borderColor: playerCreature?.id === c.id ? RARITY_COLORS[c.rarity] : '' }}
              >
                <div className="w-14 h-14">
                  <CreatureArt species={c.species} rarity={c.rarity} />
                </div>
                <p className="text-xs font-bold text-gray-200 truncate w-full text-center">
                  {c.name.split(',')[0]}
                </p>
                <p className="text-xs" style={{ color: RARITY_COLORS[c.rarity] }}>{c.rarity}</p>
              </button>
            ))}
          </div>


            {playerCreature && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="selected-preview">
                <div className="w-20 h-20 mx-auto">
                  <CreatureArt species={playerCreature.species} rarity={playerCreature.rarity} />
                </div>
                <p className="text-sm font-bold text-gray-100 mt-2">{playerCreature.name}</p>
                <p className="text-xs italic text-amber-300 mt-1">
                  "{playerCreature.taunt || 'Ready for battle!'}"
                </p>
              </div>
              <button onClick={handleStartBattle} className="battle-start-btn">
                <Swords size={20} />
                <span>Fight!</span>
              </button>
            </div>
          )}
        </div>
      ) : battle ? (
        <div>
          {/* Phase status bar */}
          <div className="phase-status-bar">
            <PhaseStatus phase={animPhase} lastResult={lastResult} />
          </div>

          {/* Fighters */}
          <div className="battle-arena-grid">
            <FighterPanel
              fighter={battle.player}
              isPlayer={true}
              isDefending={battle.player.isDefending}
              animPhase={animPhase}
              showDamage={showPlayerDamage}
            />
            <div className="arena-center">
              <Swords size={24} className="text-red-400" />
              <p className="text-xs text-gray-500 mt-1">T{battle.turn}</p>
            </div>
            <FighterPanel
              fighter={battle.cpu}
              isPlayer={false}
              isDefending={battle.cpu.isDefending}
              animPhase={animPhase}
              showDamage={showCpuDamage}
            />
          </div>

          {/* Winner */}
          {battle.winner && !isAnimating && (
            <div className={`winner-banner ${battle.winner === 'player' ? 'win' : 'lose'}`}>
              {battle.winner === 'player' ? (
                <>
                  <Trophy size={32} className="text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-400">Victory!</p>
                  <p className="text-gray-300 text-sm mt-1">{battle.player.creature.name} wins!</p>
                </>
              ) : (
                <>
                  <Skull size={32} className="text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-400">Defeated!</p>
                  <p className="text-gray-300 text-sm mt-1">{battle.cpu.creature.name} wins!</p>
                </>
              )}
              <p className="text-gray-500 text-xs mt-1">Battle ended in {battle.turn - 1} turns</p>
            </div>
          )}

          {/* Move buttons */}
          {!battle.winner && (
            <div className="moves-grid">
              {PLAYER_MOVES.map(move => (
                <button
                  key={move.type}
                  onClick={() => handleMove(move)}
                  disabled={isAnimating || (move.type === 'special' && battle.player.sp === 0)}
                  className={`move-btn ${move.type === 'special' ? 'special-move' : ''} ${isAnimating ? 'move-disabled' : ''}`}
                >
                  <span className="move-icon">{MOVE_ICONS[move.icon]}</span>
                  <span className="move-label">{move.label}</span>
                  <span className="move-desc">
                    {move.type === 'special' && battle.player.sp === 0
                      ? 'No SP left!'
                      : isAnimating ? 'Wait...'
                      : move.description}
                  </span>
                  {move.type === 'special' && (
                    <span className="move-sp">SP: {battle.player.sp}/3</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Battle log */}
          {battle.logs.length > 0 && (
            <div className="battle-log mt-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Battle History</p>
              <div className="log-entries">
                {[...battle.logs].reverse().map((log, i) => {
                  const pm = parseMessage(log.playerMessage);
                  const cm = parseMessage(log.cpuMessage);
                  return (
                    <div key={i} className="log-turn-block">
                      <span className="log-turn">T{battle.logs.length - i}</span>
                      <div className="log-messages">
                        <p className={`log-message flex items-start gap-1 ${log.isPlayerSpecial ? 'text-purple-300' : 'text-gray-300'}`}>
                          {pm.icon}{pm.text}
                        </p>
                        <p className={`log-message flex items-start gap-1 ${log.isCpuSpecial ? 'text-purple-300' : 'text-gray-400'}`}>
                          {cm.icon}{cm.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button onClick={handleReset} className="reset-btn">
              <RotateCcw size={16} />
              <span>{battle.winner ? 'Play Again' : 'Forfeit'}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}