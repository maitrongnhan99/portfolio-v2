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
      className={`relative rounded-lg bg-[#1e1e2e] p-4 font-mono text-sm shadow-xl ${className}`}
    >
      {/* Editor Header */}
      <div className="mb-4 flex items-center">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <p className="ml-4 text-gray-400">maitrongnhan.developer.js</p>
      </div>

      {/* Code Content */}
      <pre className="overflow-x-auto">
        <code className="language-javascript">
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              1
            </span>
            <span className="code-line">
              <span className="text-purple-400">const </span>
              <span className="text-gray-300">dev_profile </span>
              <span className="text-gray-300">= </span>
              <span className="text-gray-300">{"{"}</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              2
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}name: </span>
              <span className="text-green-400">'{profile.name}'</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              3
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}title: </span>
              <span className="text-green-400">'{profile.title}'</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              4
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}skills: [</span>
            </span>
          </div>
          {profile.skills.map((skill, index) => (
            <div key={skill} className="line">
              <span className="mr-4 inline-block w-8 text-right text-gray-500">
                {index + 5}
              </span>
              <span className="code-line">
                <span className="text-gray-300">{"    "}</span>
                <span className="text-green-400">'{skill}'</span>
                <span className="text-gray-300">
                  {index < profile.skills.length - 1 ? "," : ""}
                </span>
              </span>
            </div>
          ))}
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 5}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}],</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 6}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}hardWorker: </span>
              <span className="text-orange-400">
                {profile.hardWorker.toString()}
              </span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 7}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}quickLearner: </span>
              <span className="text-orange-400">
                {profile.quickLearner.toString()}
              </span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 8}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}problemSolver: </span>
              <span className="text-orange-400">
                {profile.problemSolver.toString()}
              </span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 9}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}aiDrivenDeveloper: </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 10}
            </span>
            <span className="code-line">
              <span className="text-gray-300">
                {"  "}automationEnthusiast:{" "}
              </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 11}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}efficiencyOptimizer: </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 12}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}continuousLearner: </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 13}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}scalabilityFocused: </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 9}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}yearsOfExperience: </span>
              <span className="text-blue-400">{profile.yearsOfExperience}</span>
              <span className="text-gray-300">,</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 10}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"  "}</span>
              <span className="text-purple-400">hireable: function</span>
              <span className="text-gray-300">() {"{"}</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 11}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"    "}</span>
              <span className="text-purple-400">return</span>
              <span className="text-gray-300">{" ("}</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 12}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"      "}this.hardWorker </span>
              <span className="text-purple-400">&&</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 13}
            </span>
            <span className="code-line">
              <span className="text-gray-300">
                {"      "}this.problemSolver{" "}
              </span>
              <span className="text-purple-400">&&</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 14}
            </span>
            <span className="code-line">
              <span className="text-gray-300">
                {"      "}this.skills.length{" "}
              </span>
              <span className="text-gray-300">
                {">="}
                {"  "}
              </span>
              <span className="text-blue-400">5</span>
              <span className="text-purple-400"> &&</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 15}
            </span>
            <span className="code-line">
              <span className="text-gray-300">
                {"      "}this.yearsOfExperience{" "}
              </span>
              <span className="text-gray-300">
                {">="}
                {"  "}
              </span>
              <span className="text-blue-400">5</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 16}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"    "});</span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 17}
            </span>
            <span className="code-line">
              <span className="text-gray-300">
                {"  "}
                {"}"}
              </span>
            </span>
          </div>
          <div className="line">
            <span className="mr-4 inline-block w-8 text-right text-gray-500">
              {profile.skills.length + 18}
            </span>
            <span className="code-line">
              <span className="text-gray-300">{"}"}</span>
              <span className="text-gray-300">;</span>
            </span>
          </div>
        </code>
      </pre>
    </motion.div>
  );
};

export { CodeEditor };
