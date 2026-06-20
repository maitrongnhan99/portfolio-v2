"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface Profile {
  name: string;
  title: string;
  skills: string[];
  hardWorker: boolean;
  quickLearner: boolean;
  problemSolver: boolean;
  yearsOfExperience: number;
}

interface CodeEditorProps {
  profile: Profile;
  className?: string;
}

const CodeEditor: FC<CodeEditorProps> = ({ profile, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0.8, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-card bg-canvas-white p-4 font-mono text-sm border border-borderLight shadow-outline-ring ${className}`}
    >
      {/* Editor Header */}
      <div className="mb-4 flex items-center">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="ml-4 text-text-muted">maitrongnhan.developer.ts</p>
      </div>

      {/* Code Content */}
      <pre className="overflow-x-auto">
        <code className="language-typescript">
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              1
            </span>
            <span className="code-line">
              <span className="text-[#0000ff] dark:text-purple-400">const </span>
              <span className="text-[#001080] dark:text-gray-300">dev_profile </span>
              <span className="text-[#24292f] dark:text-gray-300">= </span>
              <span className="text-[#24292f] dark:text-gray-300">{"{"}</span>
              <span className="text-[#008000] dark:text-green-400"> // TypeScript profile</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              2
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}name: </span>
              <span className="text-[#a31515] dark:text-green-400">&apos;{profile.name}&apos;</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              3
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}title: </span>
              <span className="text-[#a31515] dark:text-green-400">&apos;{profile.title}&apos;</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              4
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}skills: </span>
              <span className="text-[#24292f] dark:text-gray-300">[</span>
              <span className="text-[#008000] dark:text-green-400"> // core stack</span>
            </span>
          </div>
          {profile.skills.map((skill, index) => (
            <div key={skill} className="line">
              <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
                {index + 5}
              </span>
              <span className="code-line">
                <span className="text-[#24292f] dark:text-gray-300">{"    "}</span>
                <span className="text-[#a31515] dark:text-green-400">&apos;{skill}&apos;</span>
                <span className="text-[#24292f] dark:text-gray-300">
                  {index < profile.skills.length - 1 ? "," : ""}
                </span>
              </span>
            </div>
          ))}
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 5}
            </span>
            <span className="code-line">
              <span className="text-[#24292f] dark:text-gray-300">{"  "}],</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 6}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}hardWorker: </span>
              <span className="text-[#0000ff] dark:text-orange-400">
                {profile.hardWorker.toString()}
              </span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 7}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}quickLearner: </span>
              <span className="text-[#0000ff] dark:text-orange-400">
                {profile.quickLearner.toString()}
              </span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 8}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}problemSolver: </span>
              <span className="text-[#0000ff] dark:text-orange-400">
                {profile.problemSolver.toString()}
              </span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 9}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}aiDrivenDeveloper: </span>
              <span className="text-[#0000ff] dark:text-orange-400">true</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 10}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">
                {"  "}automationEnthusiast:{" "}
              </span>
              <span className="text-[#0000ff] dark:text-orange-400">true</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 11}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}efficiencyOptimizer: </span>
              <span className="text-[#0000ff] dark:text-orange-400">true</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 12}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}continuousLearner: </span>
              <span className="text-[#0000ff] dark:text-orange-400">true</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 13}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}scalabilityFocused: </span>
              <span className="text-[#0000ff] dark:text-orange-400">true</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 14}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}yearsOfExperience: </span>
              <span className="text-[#098658] dark:text-blue-400">{profile.yearsOfExperience}</span>
              <span className="text-[#24292f] dark:text-gray-300">,</span>
              <span className="text-[#008000] dark:text-green-400"> // production experience</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 15}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"  "}hireable: </span>
              <span className="text-[#0000ff] dark:text-purple-400">function</span>
              <span className="text-[#24292f] dark:text-gray-300">() {"{"}</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 16}
            </span>
            <span className="code-line">
              <span className="text-[#24292f] dark:text-gray-300">{"    "}</span>
              <span className="text-[#0000ff] dark:text-purple-400">return</span>
              <span className="text-[#24292f] dark:text-gray-300">{" ("}</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 17}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">{"      "}this.hardWorker </span>
              <span className="text-[#0000ff] dark:text-purple-400">&&</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 18}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">
                {"      "}this.problemSolver{" "}
              </span>
              <span className="text-[#0000ff] dark:text-purple-400">&&</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 19}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">
                {"      "}this.skills.length{" "}
              </span>
              <span className="text-[#24292f] dark:text-gray-300">
                {">="}
                {"  "}
              </span>
              <span className="text-[#098658] dark:text-blue-400">5</span>
              <span className="text-[#0000ff] dark:text-purple-400"> &&</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 20}
            </span>
            <span className="code-line">
              <span className="text-[#001080] dark:text-gray-300">
                {"      "}this.yearsOfExperience{" "}
              </span>
              <span className="text-[#24292f] dark:text-gray-300">
                {">="}
                {"  "}
              </span>
              <span className="text-[#098658] dark:text-blue-400">5</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 21}
            </span>
            <span className="code-line">
              <span className="text-[#24292f] dark:text-gray-300">{"    "});</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 22}
            </span>
            <span className="code-line">
              <span className="text-[#24292f] dark:text-gray-300">
                {"  "}
                {"}"}
              </span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-text-muted dark:text-gray-500">
              {profile.skills.length + 23}
            </span>
            <span className="code-line">
              <span className="text-[#24292f] dark:text-gray-300">{"}"}</span>
              <span className="text-[#24292f] dark:text-gray-300">;</span>
            </span>
          </div>
        </code>
      </pre>
    </motion.div>
  );
};

export { CodeEditor };
