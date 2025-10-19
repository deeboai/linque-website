import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface CustomAuthProps {
  onAuthSuccess?: () => void;
}

export const CustomAuth: React.FC<CustomAuthProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  // Disable sign up for production - only allow sign in
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Only allow sign up if no admin exists yet (for initial setup)
  const [allowSignUp, setAllowSignUp] = useState(true); // Change to false after setup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp && allowSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            // Skip email confirmation for development
            data: {
              email_confirm: true
            }
          }
        });
        
        if (error) throw error;
        
        // If user is created but needs confirmation, show appropriate message
        if (data.user && !data.session) {
          toast({
            title: 'Account created!',
            description: 'Please check your email to confirm your account, or contact your developer to disable email confirmation.'
          });
        } else {
          toast({
            title: 'Account created and signed in!',
            description: 'Welcome to your admin panel.'
          });
        }
        
        // Disable sign up after first account is created
        setAllowSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({ title: 'Welcome back!' });
        onAuthSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    if (!supabase) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`
      });
      
      if (error) throw error;
      
      toast({
        title: 'Reset email sent!',
        description: 'Check your email for password reset instructions.'
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };

  return (
    <Card className="w-full max-w-md border-muted/60 p-8 shadow-card">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Linque Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isSignUp ? 'Create your admin account' : 'Sign in to manage your website'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="etoure33@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </form>

        <div className="space-y-3">
          {/* Only show sign up during initial setup */}
          {allowSignUp && (
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : 'Initial setup? Create admin account'
                }
              </Button>
            </div>
          )}

          {!isSignUp && (
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground">
          <p>Your admin credentials:</p>
          <p className="font-mono">etoure33@gmail.com</p>
          <p className="font-mono">HelloWorld2025</p>
        </div>
      </div>
    </Card>
  );
};