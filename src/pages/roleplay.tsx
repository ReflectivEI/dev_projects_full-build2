import { useState } from 'react';
import { Play, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Scenario {
  id: string;
  title: string;
  description: string;
  diseaseState: string;
  specialty: string;
  hcpCategory: string;
  influenceDriver: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const scenarios: Scenario[] = [
  {
    id: 'hiv-1',
    title: 'Low Descovy Share with Missed PrEP Opportunity',
    description: 'IM prescriber underutilizes PrEP despite steady STI testing in young MSM',
    diseaseState: 'hiv',
    specialty: 'infectious-disease',
    hcpCategory: 'physician',
    influenceDriver: 'clinical-evidence',
    difficulty: 'intermediate',
  },
  {
    id: 'hiv-2',
    title: 'High Descovy Share but Access Barriers',
    description: 'NP with strong share faces prior-auth workload and staffing friction',
    diseaseState: 'hiv',
    specialty: 'infectious-disease',
    hcpCategory: 'nurse-practitioner',
    influenceDriver: 'workflow-efficiency',
    difficulty: 'advanced',
  },
  {
    id: 'hiv-3',
    title: 'Slowing Biktarvy Switches in Stable Patients',
    description:
      'Top HIV clinic with declining switch velocity; perception that most patients are optimized',
    diseaseState: 'hiv',
    specialty: 'infectious-disease',
    hcpCategory: 'physician',
    influenceDriver: 'patient-outcomes',
    difficulty: 'advanced',
  },
  {
    id: 'hiv-4',
    title: 'Cabotegravir Interest Without Systematic Screening',
    description:
      'CAB share growing but NP honors requests without systematic adherence/resistance evaluation',
    diseaseState: 'hiv',
    specialty: 'infectious-disease',
    hcpCategory: 'nurse-practitioner',
    influenceDriver: 'clinical-evidence',
    difficulty: 'intermediate',
  },
  {
    id: 'onc-1',
    title: 'ADC Integration with IO Backbone',
    description:
      'Solid-tumor center evaluating ADCs; P&T scrutinizes cost/response and chair time',
    diseaseState: 'oncology',
    specialty: 'oncology',
    hcpCategory: 'physician',
    influenceDriver: 'cost-effectiveness',
    difficulty: 'advanced',
  },
  {
    id: 'onc-2',
    title: 'Pathway-Driven Care with Staffing Constraints',
    description: 'Community infusion site with conservative IO use and short-staffed AE clinics',
    diseaseState: 'oncology',
    specialty: 'oncology',
    hcpCategory: 'physician',
    influenceDriver: 'workflow-efficiency',
    difficulty: 'intermediate',
  },
  {
    id: 'onc-3',
    title: 'Oral Oncolytic Onboarding Optimization',
    description: 'GU team struggles with hub forms and day-25-30 refill gaps',
    diseaseState: 'oncology',
    specialty: 'oncology',
    hcpCategory: 'physician',
    influenceDriver: 'patient-outcomes',
    difficulty: 'beginner',
  },
  {
    id: 'card-1',
    title: 'HFrEF Clinic GDMT Optimization',
    description: 'Entresto uptake 62% of eligible HFrEF; SGLT2 at 38%; day-30 refill gaps',
    diseaseState: 'cardiology',
    specialty: 'cardiology',
    hcpCategory: 'physician',
    influenceDriver: 'clinical-evidence',
    difficulty: 'advanced',
  },
  {
    id: 'card-2',
    title: 'Rural HF Program with CKD Safety Concerns',
    description:
      'SGLT2 underused in CKD stage 3 due to misconceptions; no titration calendar',
    diseaseState: 'cardiology',
    specialty: 'cardiology',
    hcpCategory: 'physician',
    influenceDriver: 'clinical-evidence',
    difficulty: 'intermediate',
  },
  {
    id: 'card-3',
    title: 'Post-MI and HF Transitions Optimization',
    description:
      'SGLT2 initiation often deferred to PCP; ARNI starts delayed pending echo; readmissions above benchmark',
    diseaseState: 'cardiology',
    specialty: 'cardiology',
    hcpCategory: 'physician',
    influenceDriver: 'patient-outcomes',
    difficulty: 'intermediate',
  },
  {
    id: 'vax-1',
    title: 'Adult Flu Program Optimization',
    description: 'ID group with LTC/high-risk adults; late clinic launches; weak reminder-recall',
    diseaseState: 'vaccines',
    specialty: 'infectious-disease',
    hcpCategory: 'physician',
    influenceDriver: 'workflow-efficiency',
    difficulty: 'intermediate',
  },
  {
    id: 'vax-2',
    title: 'Primary Care Vaccine Capture Improvement',
    description:
      'Adequate storage but VIS misses due to staff rotation; ad-hoc Saturday clinics',
    diseaseState: 'vaccines',
    specialty: 'primary-care',
    hcpCategory: 'physician',
    influenceDriver: 'workflow-efficiency',
    difficulty: 'beginner',
  },
  {
    id: 'covid-1',
    title: 'Outpatient Antiviral Optimization',
    description:
      'High-risk COPD/ILD population; Paxlovid first line but DDI triage slows prescribing',
    diseaseState: 'covid',
    specialty: 'infectious-disease',
    hcpCategory: 'physician',
    influenceDriver: 'workflow-efficiency',
    difficulty: 'advanced',
  },
  {
    id: 'covid-2',
    title: 'Post-COVID Clinic Antiviral Adherence',
    description:
      'Eligible patients present day 4-5; callbacks delay start; variable rebound education',
    diseaseState: 'covid',
    specialty: 'infectious-disease',
    hcpCategory: 'physician',
    influenceDriver: 'patient-outcomes',
    difficulty: 'beginner',
  },
  {
    id: 'onc-kol',
    title: 'Oncology KOL Introduction',
    description: 'First meeting with a key opinion leader in breast cancer treatment',
    diseaseState: 'oncology',
    specialty: 'oncology',
    hcpCategory: 'kol',
    influenceDriver: 'clinical-evidence',
    difficulty: 'advanced',
  },
  {
    id: 'card-formulary',
    title: 'Cardiology Formulary Review',
    description: 'Present to the P&T committee for formulary inclusion',
    diseaseState: 'cardiology',
    specialty: 'cardiology',
    hcpCategory: 'committee',
    influenceDriver: 'cost-effectiveness',
    difficulty: 'advanced',
  },
  {
    id: 'neuro-access',
    title: 'Neurology Market Access',
    description: 'Navigate prior authorization challenges with a payer',
    diseaseState: 'neurology',
    specialty: 'neurology',
    hcpCategory: 'payer',
    influenceDriver: 'cost-effectiveness',
    difficulty: 'intermediate',
  },
  {
    id: 'immuno-launch',
    title: 'Immunology New Product Launch',
    description: 'Introduce a newly approved biologic to a rheumatology practice',
    diseaseState: 'immunology',
    specialty: 'rheumatology',
    hcpCategory: 'physician',
    influenceDriver: 'clinical-evidence',
    difficulty: 'beginner',
  },
  {
    id: 'rare-dx',
    title: 'Rare Disease Diagnosis Journey',
    description: 'Help a physician recognize and diagnose a rare metabolic disorder',
    diseaseState: 'rare-disease',
    specialty: 'genetics',
    hcpCategory: 'physician',
    influenceDriver: 'clinical-evidence',
    difficulty: 'intermediate',
  },
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function RoleplayPage() {
  const navigate = useNavigate();
  const [diseaseState, setDiseaseState] = useState<string>('all');
  const [specialty, setSpecialty] = useState<string>('all');
  const [hcpCategory, setHcpCategory] = useState<string>('all');
  const [influenceDriver, setInfluenceDriver] = useState<string>('all');

  const handleStartScenario = (scenario: Scenario) => {
    // Navigate to chat page with scenario context
    navigate(`/chat?scenario=${scenario.id}&title=${encodeURIComponent(scenario.title)}`);
  };

  const filteredScenarios = scenarios.filter((scenario) => {
    if (diseaseState !== 'all' && scenario.diseaseState !== diseaseState) return false;
    if (specialty !== 'all' && scenario.specialty !== specialty) return false;
    if (hcpCategory !== 'all' && scenario.hcpCategory !== hcpCategory) return false;
    if (influenceDriver !== 'all' && scenario.influenceDriver !== influenceDriver) return false;
    return true;
  });

  const uniqueDiseaseStates = Array.from(new Set(scenarios.map((s) => s.diseaseState)));
  const uniqueSpecialties = Array.from(new Set(scenarios.map((s) => s.specialty)));
  const uniqueHcpCategories = Array.from(new Set(scenarios.map((s) => s.hcpCategory)));
  const uniqueInfluenceDrivers = Array.from(new Set(scenarios.map((s) => s.influenceDriver)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Role-Play Simulator</h1>
            <p className="text-xl text-muted-foreground">
              Practice pharma sales scenarios with AI feedback
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Filter Scenarios</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Disease State</label>
              <Select value={diseaseState} onValueChange={setDiseaseState}>
                <SelectTrigger>
                  <SelectValue placeholder="All disease states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All disease states</SelectItem>
                  {uniqueDiseaseStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state.charAt(0).toUpperCase() + state.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Specialty</label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specialties</SelectItem>
                  {uniqueSpecialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec.charAt(0).toUpperCase() + spec.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">HCP Category</label>
              <Select value={hcpCategory} onValueChange={setHcpCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {uniqueHcpCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Influence Driver</label>
              <Select value={influenceDriver} onValueChange={setInfluenceDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All drivers</SelectItem>
                  {uniqueInfluenceDrivers.map((driver) => (
                    <SelectItem key={driver} value={driver}>
                      {driver.charAt(0).toUpperCase() + driver.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Select a Scenario</h2>
            <p className="text-muted-foreground">
              Choose a pharma sales scenario to practice. Each scenario includes unique challenges
              and stakeholder dynamics.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredScenarios.length} of {scenarios.length} scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <Badge
                      variant="outline"
                      className={difficultyColors[scenario.difficulty]}
                    >
                      {scenario.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {scenario.diseaseState.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {scenario.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {scenario.specialty.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {scenario.hcpCategory.replace('-', ' ')}
                    </Badge>
                  </div>
                  <Button className="w-full" size="sm" onClick={() => handleStartScenario(scenario)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Scenario
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredScenarios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No scenarios match your current filters. Try adjusting your selection.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
