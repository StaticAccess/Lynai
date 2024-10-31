import Link from 'next/link'
import { Shield, Link as LinkIcon, Download, UserCircle, Zap, Globe, Server, Github, Lock, Timer } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">About Lynai</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              An open-source, privacy-focused chat platform built for secure and ephemeral conversations.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/StaticAccess/Lynai" className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  View on GitHub
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/">Start Chatting</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Shield className="h-6 w-6" />
                  Privacy First
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>End-to-end encryption with zero data storage. Your conversations are completely private and temporary.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Timer className="h-6 w-6" />
                  Ephemeral
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>Messages automatically disappear after your session ends. No logs, no history, no traces.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Github className="h-6 w-6" />
                  Open Source
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>Fully transparent and community-driven. Audit the code, contribute, or host your own instance.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<LinkIcon className="h-6 w-6" />}
              title="Instant Chat Links"
              description="Generate unique, shareable links for private conversations."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Password Protected"
              description="Secure your chat rooms with custom passwords."
            />
            <FeatureCard
              icon={<UserCircle className="h-6 w-6" />}
              title="No Registration"
              description="Start chatting instantly - no account required."
            />
            <FeatureCard
              icon={<Download className="h-6 w-6" />}
              title="Save Conversations"
              description="Download chat history before it's permanently deleted."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Lightning Fast"
              description="Built for speed with modern web technologies."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Tor Compatible"
              description="Enhanced privacy through Tor network support."
            />
          </div>

          <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-6 w-6 text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">Privacy Commitment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <ul className="space-y-2 text-slate-600">
                <li>No personal data or message content is ever stored on our servers</li>
                <li>No IP addresses or location data is collected or logged</li>
                <li>No tracking cookies or analytics</li>
                <li>All messages are encrypted end-to-end</li>
                <li>Chat history is automatically deleted after the session ends</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Ready to start a secure conversation?</h2>
            <Button asChild size="lg">
              <Link href="/">Create Chat Room</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border border-slate-200 hover:border-slate-300 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  )
}