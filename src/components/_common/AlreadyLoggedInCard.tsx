import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

export function AlreadyLoggedInCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Already Logged In</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>You are already logged in.</CardDescription>
      </CardContent>
    </Card>
  )
}
