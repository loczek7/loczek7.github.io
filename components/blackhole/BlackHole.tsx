import type { Messages } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowUpIcon } from "@/components/ui/icons";
import styles from "./BlackHole.module.css";

type BlackHoleProps = {
  t: Messages["blackhole"];
};

// End-of-page black hole. SVG ported 1:1 from the prototype (decorative).
export function BlackHole({ t }: BlackHoleProps) {
  return (
    <section className={styles.bh} aria-label={t.aria}>
      <div className={styles.stage} aria-hidden="true">
        <svg
          className={styles.svg}
          viewBox="0 0 1200 460"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="bhb1"
              filterUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height="460"
            >
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            <filter
              id="bhb3"
              filterUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height="460"
            >
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            <filter
              id="bhb8"
              filterUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height="460"
            >
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter
              id="bhb20"
              filterUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height="460"
            >
              <feGaussianBlur stdDeviation="20" />
            </filter>
            <radialGradient id="bhAtmo" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ff7828" stopOpacity=".2" />
              <stop offset=".6" stopColor="#963210" stopOpacity=".08" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id="bhBand"
              gradientUnits="userSpaceOnUse"
              x1="70"
              y1="0"
              x2="1200"
              y2="0"
            >
              <stop offset="0" stopColor="#ff7a2a" stopOpacity="0" />
              <stop offset=".1" stopColor="#ff6a1f" stopOpacity=".55" />
              <stop offset=".3" stopColor="#ff8a2a" />
              <stop offset=".44" stopColor="#ffd08a" />
              <stop offset=".56" stopColor="#fff4d8" />
              <stop offset=".72" stopColor="#ffe1ac" />
              <stop offset=".88" stopColor="#ff9a3a" stopOpacity=".85" />
              <stop offset="1" stopColor="#ff7a2a" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="bhHot"
              gradientUnits="userSpaceOnUse"
              x1="150"
              y1="0"
              x2="1150"
              y2="0"
            >
              <stop offset="0" stopColor="#ffd9a0" stopOpacity="0" />
              <stop offset=".3" stopColor="#ffd9a0" stopOpacity=".6" />
              <stop offset=".5" stopColor="#ffffff" />
              <stop offset=".75" stopColor="#fff1d2" stopOpacity=".9" />
              <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="bhStreak"
              gradientUnits="userSpaceOnUse"
              x1="40"
              y1="0"
              x2="1200"
              y2="0"
            >
              <stop offset="0" stopColor="#ff8a3a" stopOpacity="0" />
              <stop offset=".2" stopColor="#ff8a3a" stopOpacity=".5" />
              <stop offset=".46" stopColor="#ffe1b0" stopOpacity=".9" />
              <stop offset=".6" stopColor="#ffd08a" stopOpacity=".8" />
              <stop offset="1" stopColor="#ff8a3a" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="bhArc"
              gradientUnits="userSpaceOnUse"
              x1="300"
              y1="0"
              x2="748"
              y2="0"
            >
              <stop offset="0" stopColor="#ff7a2a" stopOpacity=".55" />
              <stop offset=".35" stopColor="#ffc277" />
              <stop offset=".6" stopColor="#fff1d0" />
              <stop offset=".85" stopColor="#ffc277" />
              <stop offset="1" stopColor="#ff8a3a" stopOpacity=".6" />
            </linearGradient>
            <linearGradient
              id="bhRingV"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="119"
              x2="0"
              y2="321"
            >
              <stop offset="0" stopColor="#fff8e8" />
              <stop offset=".45" stopColor="#ffd9a0" stopOpacity=".85" />
              <stop offset="1" stopColor="#ff9a50" stopOpacity=".75" />
            </linearGradient>
            <linearGradient id="bhWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff6e0" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff6e0" stopOpacity=".6" />
              <stop offset="1" stopColor="#fff6e0" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="bhPl" cx="35%" cy="40%" r="70%">
              <stop offset="0" stopColor="#2a3040" />
              <stop offset="1" stopColor="#090b12" />
            </radialGradient>
            <clipPath id="bhTop">
              <rect x="0" y="0" width="1200" height="232" />
            </clipPath>
            <clipPath id="bhClipBand">
              <path d="M 70 268 C 220 262, 360 232, 500 214 C 560 208, 640 208, 720 209 C 880 208, 1040 205, 1200 202 L 1200 238 C 1040 240, 880 240, 720 238 C 640 238, 560 238, 500 238 C 360 244, 220 262, 70 272 Z" />
            </clipPath>
          </defs>

          <ellipse cx="600" cy="230" rx="560" ry="250" fill="url(#bhAtmo)" />

          <g clipPath="url(#bhTop)">
            <circle
              cx="600"
              cy="220"
              r="132"
              fill="none"
              stroke="#b5481a"
              strokeWidth="38"
              opacity=".5"
              filter="url(#bhb20)"
            />
          </g>
          <g fill="none" stroke="#ff9650" filter="url(#bhb1)">
            <path
              d="M 440 222 A 160 160 0 0 1 760 222"
              strokeOpacity=".22"
              strokeWidth="1.6"
            />
            <path
              d="M 424 224 A 176 176 0 0 1 776 224"
              strokeOpacity=".15"
              strokeWidth="1.4"
            />
            <path
              d="M 406 226 A 194 194 0 0 1 794 226"
              strokeOpacity=".1"
              strokeWidth="1.2"
            />
          </g>

          <ellipse
            cx="600"
            cy="292"
            rx="640"
            ry="46"
            fill="#7a2a0a"
            opacity=".45"
            filter="url(#bhb20)"
          />
          <ellipse
            cx="640"
            cy="262"
            rx="520"
            ry="22"
            fill="#c4521a"
            opacity=".35"
            filter="url(#bhb8)"
          />
          <g fill="none" stroke="url(#bhStreak)" filter="url(#bhb1)">
            <path
              d="M 80 302 C 300 294, 480 272, 620 264 S 1000 260, 1200 264"
              strokeWidth="1"
              opacity=".35"
            />
            <path
              d="M 120 320 C 320 308, 500 286, 640 278 S 1000 276, 1200 282"
              strokeWidth="1"
              opacity=".25"
            />
            <path
              d="M 200 338 C 380 326, 540 304, 680 296 S 1020 296, 1200 302"
              strokeWidth="1"
              opacity=".18"
            />
            <path
              d="M 100 286 C 300 280, 480 258, 620 250 S 1000 246, 1200 248"
              strokeWidth="1"
              opacity=".3"
            />
          </g>

          <circle cx="600" cy="220" r="99" fill="#000000" />

          <circle
            cx="600"
            cy="220"
            r="101"
            fill="none"
            stroke="#ffb870"
            strokeWidth="7"
            opacity=".5"
            filter="url(#bhb3)"
          />
          <path
            d="M 500 232 A 101 101 0 0 0 700 232"
            fill="none"
            stroke="#ff8a3a"
            strokeWidth="9"
            opacity=".45"
            filter="url(#bhb3)"
          />
          <circle
            cx="600"
            cy="220"
            r="101"
            fill="none"
            stroke="url(#bhRingV)"
            strokeWidth="2.4"
            filter="url(#bhb1)"
          />

          <path
            d="M 300 258 C 372 196, 468 112, 600 106 C 706 101, 748 158, 748 216"
            fill="none"
            stroke="#ff6a1f"
            strokeWidth="30"
            strokeLinecap="round"
            opacity=".55"
            filter="url(#bhb8)"
          />
          <path
            d="M 300 258 C 372 196, 468 112, 600 106 C 706 101, 748 158, 748 216"
            fill="none"
            stroke="url(#bhArc)"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#bhb3)"
          />
          <path
            d="M 300 258 C 372 196, 468 112, 600 106 C 706 101, 748 158, 748 216"
            fill="none"
            stroke="#fff6e0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity=".95"
            filter="url(#bhb1)"
          />
          <path
            d="M 318 262 C 392 192, 482 100, 600 94 C 718 90, 770 156, 770 214"
            fill="none"
            stroke="#ffb070"
            strokeWidth="1.6"
            opacity=".55"
            filter="url(#bhb1)"
          />
          <path
            d="M 290 268 C 366 184, 470 84, 600 78 C 735 73, 794 150, 794 212"
            fill="none"
            stroke="#ff8a40"
            strokeWidth="1.2"
            opacity=".35"
            filter="url(#bhb1)"
          />

          <path
            d="M 70 268 C 220 262, 360 232, 500 214 C 560 208, 640 208, 720 209 C 880 208, 1040 205, 1200 202 L 1200 238 C 1040 240, 880 240, 720 238 C 640 238, 560 238, 500 238 C 360 244, 220 262, 70 272 Z"
            fill="#ff7a2a"
            opacity=".5"
            filter="url(#bhb8)"
          />
          <path
            d="M 70 268 C 220 262, 360 232, 500 214 C 560 208, 640 208, 720 209 C 880 208, 1040 205, 1200 202 L 1200 238 C 1040 240, 880 240, 720 238 C 640 238, 560 238, 500 238 C 360 244, 220 262, 70 272 Z"
            fill="url(#bhBand)"
            filter="url(#bhb1)"
          />
          <g clipPath="url(#bhClipBand)">
            <rect
              className={styles.wave}
              x="0"
              y="190"
              width="260"
              height="80"
              fill="url(#bhWave)"
            />
            <rect
              className={styles.wave}
              x="-300"
              y="190"
              width="200"
              height="80"
              fill="url(#bhWave)"
              style={{ animationDelay: "-3.5s" }}
            />
          </g>
          <path
            d="M 150 266 C 320 256, 450 226, 600 221 C 760 217, 960 218, 1150 220 C 960 224, 760 225, 600 227 C 450 230, 320 262, 150 267 Z"
            fill="url(#bhHot)"
            filter="url(#bhb1)"
          />
          <g fill="none" stroke="url(#bhStreak)" filter="url(#bhb1)">
            <path
              d="M 60 272 C 220 266, 360 238, 500 222"
              strokeWidth="1.2"
              opacity=".8"
            />
            <path
              d="M 90 280 C 250 270, 380 244, 520 228"
              strokeWidth="1"
              opacity=".6"
            />
            <path
              d="M 40 262 C 200 256, 350 228, 490 214"
              strokeWidth="1"
              opacity=".55"
            />
            <path
              d="M 120 290 C 270 280, 400 252, 540 234"
              strokeWidth=".9"
              opacity=".4"
            />
            <path
              d="M 640 226 C 820 222, 1000 218, 1200 214"
              strokeWidth="1.2"
              opacity=".7"
            />
            <path
              d="M 640 232 C 820 230, 1000 228, 1200 226"
              strokeWidth="1"
              opacity=".5"
            />
            <path
              d="M 680 214 C 860 210, 1020 206, 1200 202"
              strokeWidth="1"
              opacity=".5"
            />
          </g>

          <g className={styles.moon}>
            <circle cx="207" cy="322" r="13" fill="url(#bhPl)" />
            <path
              d="M 215 312 A 13 13 0 0 1 215 332"
              fill="none"
              stroke="#ffa860"
              strokeWidth="1.4"
              opacity=".7"
            />
          </g>
          <g fill="#ffffff">
            <circle cx="90" cy="60" r="1" opacity=".6" />
            <circle cx="210" cy="150" r="1.2" opacity=".5" />
            <circle cx="330" cy="40" r="1" opacity=".5" />
            <circle cx="880" cy="70" r="1.2" opacity=".6" />
            <circle cx="1010" cy="140" r="1" opacity=".5" />
            <circle cx="1120" cy="50" r="1" opacity=".6" />
            <circle cx="150" cy="390" r="1" opacity=".4" />
            <circle cx="470" cy="360" r="1" opacity=".4" />
            <circle cx="930" cy="340" r="1.2" opacity=".4" />
          </g>
          <g stroke="#ffffff" strokeWidth=".8" opacity=".5">
            <path d="M 980 118 l 7 -2" />
            <path d="M 260 96 l 6 -3" />
            <path d="M 1060 300 l 8 -1" />
            <path d="M 720 372 l 7 -2" />
          </g>
        </svg>
      </div>
      <div className={`reveal ${styles.text}`}>
        <span className="kicker">{t.kicker}</span>
        <h2 className={`display ${styles.title}`}>{t.title}</h2>
        <p className={styles.p}>{t.text}</p>
        <ButtonLink variant="ghost" href="#top">
          {t.back}
          <ArrowUpIcon />
        </ButtonLink>
      </div>
    </section>
  );
}
