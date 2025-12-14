import React, {
  useMemo,
  useEffect,
  useRef,
  ComponentPropsWithoutRef,
} from "react";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import functionPlot from "function-plot";
import "katex/dist/katex.min.css";

type ForceData = {
  name: string;
  x: number; // Horizontal component (e.g., 10)
  y: number; // Vertical component (e.g., -10)
  color?: string;
};

type MathPlotData = {
  fn: string; // e.g., "x^2"
  domain?: [number, number];
};

type CodeProps = ComponentPropsWithoutRef<"code">;

// ----------------------------------------------------------------------
// Component 1: Math Function Plotter (using function-plot)
// ----------------------------------------------------------------------
const MathGraph = ({ code }: { code: string }) => {
  const rootEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const data: MathPlotData = JSON.parse(code);

      if (rootEl.current) {
        functionPlot({
          target: rootEl.current,
          width: 500,
          height: 300,
          grid: true,
          data: [
            {
              fn: data.fn,
              color: "#2563eb", // blue-600
              graphType: "polyline",
            },
          ],
          xAxis: { domain: data.domain || [-10, 10] },
          yAxis: { domain: [-10, 10] },
        });
      }
    } catch (e) {
      console.error("Failed to render math graph", e);
    }
  }, [code]);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-2">
      <div ref={rootEl} />
    </div>
  );
};

// ----------------------------------------------------------------------
// Component 2: Physics Force Diagram (Native SVG - No Maffs needed)
// ----------------------------------------------------------------------
const ForceDiagram = ({ code }: { code: string }) => {
  const forces: ForceData[] = useMemo(() => {
    try {
      return JSON.parse(code);
    } catch {
      return [];
    }
  }, [code]);

  // SVG Config
  const size = 300;
  const center = size / 2;
  const scale = 20; // Scale factor: 1 unit = 20px

  return (
    <div className="my-6 flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Define Arrow Marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
          </marker>
        </defs>

        {/* Grid Lines (Optional background) */}
        <line
          x1={center}
          y1={0}
          x2={center}
          y2={size}
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        <line
          x1={0}
          y1={center}
          x2={size}
          y2={center}
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* The Object (Block) */}
        <rect
          x={center - 20}
          y={center - 20}
          width={40}
          height={40}
          fill="#374151" // gray-700
          rx={4}
        />

        {/* Force Vectors */}
        {forces.map((f, i) => {
          // SVG Y-axis is inverted (down is positive), so we negate f.y
          const endX = center + f.x * scale;
          const endY = center - f.y * scale;
          const color = f.color || "#ef4444"; // default red

          return (
            <g key={i}>
              {/* The Arrow Line */}
              <line
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth="3"
                markerEnd={`url(#arrowhead-${i})`} // Use unique marker for color
              />

              {/* Dynamic Colored Marker */}
              <defs>
                <marker
                  id={`arrowhead-${i}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
              </defs>

              {/* Force Label */}
              <text
                x={endX + (f.x >= 0 ? 10 : -20)}
                y={endY + (f.y >= 0 ? -10 : 20)}
                fill={color}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {f.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const MarkdownRenderer = ({ source }: { source: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[[rehypeKatex, { output: "html" }]]}
      components={{
        code({ className, children, ...props }: CodeProps) {
          const match = /language-([\w-]+)/.exec(className || "");
          const lang = match ? match[1] : "";
          const content = String(children).replace(/\n$/, "");

          if (lang === "plot-function") {
            return <MathGraph code={content} />;
          }

          if (lang === "plot-force") {
            return <ForceDiagram code={content} />;
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {source}
    </Markdown>
  );
};

export const MemoizedMarkdown = React.memo(MarkdownRenderer);
