import React from 'react';
import { MessageSquare, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Community = () => {
    const [topics, setTopics] = React.useState([]);
    const [meetups, setMeetups] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            setLoading(true);
            // Fetch Topics (Posts)
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles:author_id (username)
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (postsError) throw postsError;

            // Fetch Meetups
            const { data: meetupsData, error: meetupsError } = await supabase
                .from('meetups')
                .select('*')
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true })
                .limit(3);

            if (meetupsError) throw meetupsError;

            setTopics(postsData || []);
            setMeetups(meetupsData || []);
        } catch (error) {
            console.error('Error fetching community data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Community Hub</h1>
                    <p className="text-xl text-slate-600">Connect, share, and grow with other homeschooling families.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forum Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="h-6 w-6 text-brand-green" />
                                    Recent Discussions
                                </h2>
                                <button className="text-brand-green font-medium hover:text-brand-olive text-sm">View All</button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-slate-500">Loading discussions...</div>
                            ) : topics.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">No discussions yet. Be the first to start one!</div>
                            ) : (
                                <div className="space-y-4">
                                    {topics.map((topic) => (
                                        <div key={topic.id} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-slate-900 hover:text-brand-green">{topic.title}</h3>
                                                <span className="px-2 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-medium">
                                                    {topic.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span>by {topic.profiles?.username || 'Unknown'}</span>
                                                <span>•</span>
                                                <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{topic.views || 0} views</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button className="w-full mt-6 py-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                Start a New Discussion
                            </button>
                        </div>
                    </div>

                    {/* Meetups Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <Users className="h-6 w-6 text-brand-green" />
                                    Upcoming Meetups
                                </h2>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-slate-500">Loading meetups...</div>
                            ) : meetups.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">No upcoming meetups found.</div>
                            ) : (
                                <div className="space-y-4">
                                    {meetups.map((meetup) => (
                                        <div key={meetup.id} className="p-4 rounded-xl border border-slate-100 hover:border-brand-green/30 transition-colors">
                                            <h3 className="font-bold text-slate-900 mb-2">{meetup.title}</h3>
                                            <div className="space-y-2 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                    {new Date(meetup.date).toLocaleDateString()} at {new Date(meetup.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                    {meetup.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-slate-400" />
                                                    {meetup.attendees_count || 0} attending
                                                </div>
                                            </div>
                                            <button className="w-full mt-4 py-2 rounded-lg bg-brand-green/10 text-brand-green font-medium text-sm hover:bg-brand-green/20 transition-colors">
                                                Join Meetup
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white text-center">
                                <h3 className="font-bold mb-2">Host a Meetup</h3>
                                <p className="text-sm text-slate-300 mb-4">Organize a gathering for families in your area.</p>
                                <button className="px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors">
                                    Create Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
