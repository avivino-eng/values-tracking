import { useState, useEffect } from 'react';
import { Printer, Calendar, QrCode } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { QRCodeSVG as QRCode } from 'qrcode.react';
// Add global styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    html, body, #root {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100vh;
    }
  `;
  if (!document.head.querySelector('style[data-app-styles]')) {
    styleEl.setAttribute('data-app-styles', 'true');
    document.head.appendChild(styleEl);
  }
}

export default function ValuesWorksheet() {
  const [currentPart, setCurrentPart] = useState(0);
  const [comfortActivities, setComfortActivities] = useState(['', '', '', '', '']);
  const [selectedValues, setSelectedValues] = useState(['', '', '', '', '']);
  const [valuesActivities, setValuesActivities] = useState(['', '', '', '', '']);
  const [comfortChecks, setComfortChecks] = useState([false, false, false, false, false]);
  const [valuesChecks, setValuesChecks] = useState([false, false, false, false, false]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('valuesWorksheetData');
    if (saved) {
      const data = JSON.parse(saved);
      setComfortActivities(data.comfortActivities || ['', '', '', '', '']);
      setSelectedValues(data.selectedValues || ['', '', '', '', '']);
      setValuesActivities(data.valuesActivities || ['', '', '', '', '']);
      setWeeklyData(data.weeklyData || []);
      setIsTracking(data.isTracking || false);
    }
  }, []);

  const saveData = (updates = {}) => {
    const dataToSave = {
      comfortActivities,
      selectedValues,
      valuesActivities,
      weeklyData,
      isTracking,
      ...updates
    };
    localStorage.setItem('valuesWorksheetData', JSON.stringify(dataToSave));
  };

  const valuesList = [
    'Achievement', 'Adventure', 'Creativity', 'Close relationships',
    'Connection to a larger purpose', 'Helping others', 'Honesty',
    'Independence', 'Kindness', 'Spirituality', 'Personal growth',
    'Pleasure and satisfaction', 'Physical wellbeing', 'Resilience', 'Safety'
  ];

  const handlePrint = () => window.print();

  const startTracking = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      comfortCount: comfortChecks.filter(c => c).length,
      valuesCount: valuesChecks.filter(c => c).length
    };
    const newWeeklyData = [...weeklyData, newEntry];
    setWeeklyData(newWeeklyData);
    setIsTracking(true);
    saveData({ weeklyData: newWeeklyData, isTracking: true });
    setCurrentPart(7);
  };

  const saveWeeklyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      comfortCount: comfortChecks.filter(c => c).length,
      valuesCount: valuesChecks.filter(c => c).length
    };
    const newWeeklyData = [...weeklyData, newEntry];
    setWeeklyData(newWeeklyData);
    setComfortChecks([false, false, false, false, false]);
    setValuesChecks([false, false, false, false, false]);
    saveData({ weeklyData: newWeeklyData });
    setShowCheckIn(false);
  };

  const goToCheckIn = () => {
    setComfortChecks([false, false, false, false, false]);
    setValuesChecks([false, false, false, false, false]);
    setShowCheckIn(true);
  };

  const handleStartOver = () => setShowStartOverConfirm(true);

  const confirmStartOver = () => {
    localStorage.removeItem('valuesWorksheetData');
    setComfortActivities(['', '', '', '', '']);
    setSelectedValues(['', '', '', '', '']);
    setValuesActivities(['', '', '', '', '']);
    setComfortChecks([false, false, false, false, false]);
    setValuesChecks([false, false, false, false, false]);
    setWeeklyData([]);
    setIsTracking(false);
    setShowCheckIn(false);
    setShowStartOverConfirm(false);
    setCurrentPart(0);
  };

  const cancelStartOver = () => setShowStartOverConfirm(false);

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      padding: '2rem 1rem'
    },
    card: {
      maxWidth: '56rem',
      margin: '0 auto',
      background: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '2rem'
    },
    h1: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: '1rem'
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    p: {
      color: '#374151',
      marginBottom: '1rem',
      lineHeight: '1.6'
    },
    introText: {
      fontSize: '1.125rem',
      color: '#4b5563',
      textAlign: 'center',
      maxWidth: '42rem',
      margin: '0 auto 2rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      marginBottom: '0.75rem',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      color: '#1f2937'
    },
    button: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    btnPrimary: {
      background: '#2563eb',
      color: 'white'
    },
    btnSuccess: {
      background: '#059669',
      color: 'white'
    },
    btnSecondary: {
      background: '#4b5563',
      color: 'white'
    },
    btnDanger: {
      background: '#dc2626',
      color: 'white'
    },
    progressBar: {
      marginBottom: '2rem'
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: '#4b5563',
      marginBottom: '0.5rem'
    },
    progressTrack: {
      width: '100%',
      background: '#e5e7eb',
      borderRadius: '9999px',
      height: '0.5rem',
      overflow: 'hidden'
    },
    progressFill: {
      background: '#2563eb',
      height: '100%',
      transition: 'width 0.3s'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    activityBox: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '2px solid'
    },
    comfortBox: {
      background: '#fffbeb',
      borderColor: '#fcd34d'
    },
    valuesBox: {
      background: '#ecfdf5',
      borderColor: '#6ee7b7'
    },
    infoBox: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    infoBoxSuccess: {
      background: '#ecfdf5',
      borderLeft: '4px solid #059669'
    },
    infoBoxBlue: {
      background: '#eff6ff',
      borderLeft: '4px solid #2563eb'
    },
    infoBoxGray: {
      background: '#f9fafb',
      borderLeft: '4px solid #6b7280'
    },
    infoBoxWhite: {
      background: 'white',
      border: '1px solid #e5e7eb',
      borderLeft: '4px solid #2563eb'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    },
    modalContent: {
      background: 'white',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      maxWidth: '28rem',
      width: '100%'
    },
    modalButtons: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem'
    },
    valueGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#4b5563'
    },
    checkInEntry: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem'
    },
    activityItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.5rem 0'
    },
    checkbox: {
      marginTop: '0.25rem',
      width: '1.25rem',
      height: '1.25rem',
      cursor: 'pointer'
    },
    backButton: {
      marginTop: '1rem',
      color: '#2563eb',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '1rem'
    }
  };

   const parts = [
// Introduction
<div key="intro" style={{ marginBottom: '1.5rem' }}>
  <h1 style={styles.h1}>Values-Based Exercise</h1>
  <p style={styles.introText}>
    This exercise helps you see how your daily choices align with your values, and find small ways to move toward what's important to you.
  </p>
  {isTracking ? (
    <div>
      <button
        onClick={goToCheckIn}
        style={{ ...styles.button, ...styles.btnSuccess }}
      >
        <Calendar size={20} />
        <span>Check-In</span>
      </button>
      <button
        onClick={() => setCurrentPart(7)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        View Progress
      </button>
      <button
        onClick={() => setShowQRCode(true)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        <>
          <QrCode size={20} />
          <span>Share</span>
        </>
      </button>
      <button
        onClick={handleStartOver}
        style={{ ...styles.button, ...styles.btnSecondary }}
      >
        Start Over
      </button>
    </div>
  ) : (
    <div>
      <button
        onClick={() => setCurrentPart(1)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Begin Exercise
      </button>
      <button
        onClick={() => setShowQRCode(true)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        <>
          <QrCode size={20} />
          <span>Share</span>
        </>
      </button>
    </div>
  )}
</div>,    
    // Part 1
    <div key="part1">
      <h2 style={styles.h2}>Part 1: What are things you do regularly to help yourself feel better?</h2>
      <p style={styles.p}>
        We all have activities we turn to when life feels overwhelming, when we need immediate relief, or when we're dealing with something difficult. These activities help us deal with stress and bad feelings.
      </p>
      <p style={{ ...styles.p, fontWeight: '500' }}>
        List 4-5 activities you do regularly for immediate comfort, entertainment, or when dealing with something difficult:
      </p>
      <p style={{ ...styles.p, fontSize: '0.875rem', fontStyle: 'italic', color: '#6b7280' }}>
        Examples: Taking a nap, listening to music, scrolling social media, calling a friend to vent, watching TV, playing games, having a drink, sitting outside, comfort eating, browsing online, staying in bed, smoking or vaping, petting your dog or cat.
      </p>
      {comfortActivities.map((activity, index) => (
        <input
          key={index}
          type="text"
          value={activity}
          onChange={(e) => {
            const newActivities = [...comfortActivities];
            newActivities[index] = e.target.value;
            setComfortActivities(newActivities);
            saveData({ comfortActivities: newActivities });
          }}
          placeholder={`Activity ${index + 1}`}
          style={styles.input}
        />
      ))}
      <button
        onClick={() => setCurrentPart(2)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Continue
      </button>
    </div>,

    // Exposition
    <div key="exposition">
      <h2 style={styles.h2}>Use this exercise to help you connect to the things that are most important to you.</h2>
      <p style={styles.p}>
        This exercise focuses on values. Values are different from goals. A goal is something you can achieve or complete, like getting a job, losing weight, or making a friend. A value is an ongoing direction, like growing as a person, fostering wellbeing, or contributing to a community. Values cannot be finished or completed. We move toward or away from values through daily choices.
      </p>
      <p style={styles.p}>
        Values are also different from morals or judgements. Morals say whether things are right or wrong, and judgements say whether something is good or bad. Morals and judgements often tell us about things we should avoid doing so that we are not bad people. Values tell you what you want and how you want to be because of what is important to you. A value cannot be right or wrong.
      </p>
      <p style={styles.p}>
        Every day, we make decisions about how to spend our time and energy. Some of these choices move us toward what we care deeply about. Others help us cope with stress, find comfort, or avoid difficult feelings in the moment.
      </p>
      <p style={styles.p}>
        When we're under stress or facing challenges, we naturally tend to find activities that provide relief or comfort in the moment. Our bodies and minds are designed to seek relief when we're struggling.
      </p>
      <p style={styles.p}>
        This exercise helps you reflect on how your values shape your choices and activities, and what your values might tell you about what you need or how you want to be. As you complete this task, remember to be curious and self-compassionate. There are no right or wrong or good or bad answers, only what is important to you.
      </p>
      <button
        onClick={() => setCurrentPart(3)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Continue
      </button>
    </div>,

    // Part 2
    <div key="part2">
      <h2 style={styles.h2}>Part 2: What values are most important to you?</h2>
      <p style={styles.p}>
        Values are the qualities and directions that give your life meaning. They represent who you want to be and how you want to relate to the world. Think about what matters most deeply to you. Below is a list of some common values.
      </p>
      <p style={styles.p}>
        You might find some, all, or none of these important. You can also add your own. Choose 5 values that are important to you and rank them with the most important at the top.
      </p>
      <div style={{ ...styles.infoBox, ...styles.infoBoxGray }}>
        <p style={{ ...styles.p, fontWeight: '500', marginBottom: '0.5rem' }}>Common values:</p>
        <div style={styles.valueGrid}>
          {valuesList.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      </div>
      <p style={{ ...styles.p, fontWeight: '500' }}>List your 5 most important values in order:</p>
      {selectedValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => {
            const newValues = [...selectedValues];
            newValues[index] = e.target.value;
            setSelectedValues(newValues);
            saveData({ selectedValues: newValues });
          }}
          placeholder={`Value ${index + 1} (most important ${index === 0 ? 'first' : ''})`}
          style={styles.input}
        />
      ))}
      <button
        onClick={() => setCurrentPart(4)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Continue
      </button>
    </div>,

    // Part 3
    <div key="part3">
      <h2 style={styles.h2}>Part 3: What activities connect you to your values?</h2>
      <p style={styles.p}>
        Think about the specific things you can do that connect to these values. These are activities that, when you do them, make you feel like you're living according to what matters most to you. They might require effort or be challenging, but they align with who you want to be.
      </p>
      
      {selectedValues.some(v => v) && (
        <div style={{ ...styles.infoBox, ...styles.infoBoxBlue }}>
          <p style={{ ...styles.p, fontWeight: '500', marginBottom: '0.5rem' }}>Your values:</p>
          {selectedValues.map((value, index) => (
            value && <div key={index} style={{ color: '#374151', marginBottom: '0.25rem' }}>{index + 1}. {value}</div>
          ))}
        </div>
      )}
      
      <p style={{ ...styles.p, fontWeight: '500' }}>
        List 4-5 specific activities you do that connect to your most important values:
      </p>
      <p style={{ ...styles.p, fontSize: '0.875rem', fontStyle: 'italic', color: '#6b7280' }}>
        Examples: Calling family members, exercising, volunteering, creating art, studying, practicing faith, spending quality time with friends, working on meaningful projects, being in nature, helping colleagues.
      </p>
      {valuesActivities.map((activity, index) => (
        <input
          key={index}
          type="text"
          value={activity}
          onChange={(e) => {
            const newActivities = [...valuesActivities];
            newActivities[index] = e.target.value;
            setValuesActivities(newActivities);
            saveData({ valuesActivities: newActivities });
          }}
          placeholder={`Activity ${index + 1}`}
          style={styles.input}
        />
      ))}
      <button
        onClick={() => setCurrentPart(5)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Continue
      </button>
    </div>,

    // Part 4 - Comparison
    <div key="part4">
      <h2 style={styles.h2}>Part 4: Compare your lists</h2>
      <p style={styles.p}>
        Now, look at all the activities you listed in Parts 1 and 3. Check any activities you actually did in the past 7 days. If some of your values-based activities happen once a week or less, note that too.
      </p>
      
      <div style={styles.grid}>
        <div style={{ ...styles.activityBox, ...styles.comfortBox }}>
          <h3 style={{ ...styles.h3, color: '#78350f' }}>Comfort Activities</h3>
          {comfortActivities.map((activity, index) => (
            activity && (
              <label key={index} style={styles.activityItem}>
                <input
                  type="checkbox"
                  checked={comfortChecks[index]}
                  onChange={(e) => {
                    const newChecks = [...comfortChecks];
                    newChecks[index] = e.target.checked;
                    setComfortChecks(newChecks);
                  }}
                  style={styles.checkbox}
                />
                <span style={{ color: '#1f2937' }}>{activity}</span>
              </label>
            )
          ))}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fcd34d' }}>
            <p style={{ fontWeight: 'bold', color: '#78350f' }}>
              Total checked: {comfortChecks.filter(c => c).length}
            </p>
          </div>
        </div>

        <div style={{ ...styles.activityBox, ...styles.valuesBox }}>
          <h3 style={{ ...styles.h3, color: '#065f46' }}>Values-Based Activities</h3>
          {valuesActivities.map((activity, index) => (
            activity && (
              <label key={index} style={styles.activityItem}>
                <input
                  type="checkbox"
                  checked={valuesChecks[index]}
                  onChange={(e) => {
                    const newChecks = [...valuesChecks];
                    newChecks[index] = e.target.checked;
                    setValuesChecks(newChecks);
                  }}
                  style={styles.checkbox}
                />
                <span style={{ color: '#1f2937' }}>{activity}</span>
              </label>
            )
          ))}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #6ee7b7' }}>
            <p style={{ fontWeight: 'bold', color: '#065f46' }}>
              Total checked: {valuesChecks.filter(c => c).length}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentPart(6)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Continue to Reflection
      </button>
    </div>,

    // Reflection
    <div key="reflection">
      <h2 style={styles.h2}>Reflection</h2>
      
      <div style={styles.grid}>
        <div style={{ ...styles.activityBox, ...styles.comfortBox }}>
          <h3 style={{ ...styles.h3, color: '#78350f' }}>Comfort Activities</h3>
          {comfortActivities.map((activity, index) => (
            activity && (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
                <span style={{ fontSize: '1.125rem' }}>{comfortChecks[index] ? '✓' : '○'}</span>
                <span style={{ color: '#1f2937' }}>{activity}</span>
              </div>
            )
          ))}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fcd34d' }}>
            <p style={{ fontWeight: 'bold', color: '#78350f' }}>
              Total checked: {comfortChecks.filter(c => c).length}
            </p>
          </div>
        </div>

        <div style={{ ...styles.activityBox, ...styles.valuesBox }}>
          <h3 style={{ ...styles.h3, color: '#065f46' }}>Values-Based Activities</h3>
          {valuesActivities.map((activity, index) => (
            activity && (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
                <span style={{ fontSize: '1.125rem' }}>{valuesChecks[index] ? '✓' : '○'}</span>
                <span style={{ color: '#1f2937' }}>{activity}</span>
              </div>
            )
          ))}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #6ee7b7' }}>
            <p style={{ fontWeight: 'bold', color: '#065f46' }}>
              Total checked: {valuesChecks.filter(c => c).length}
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ ...styles.infoBox, ...styles.infoBoxGray }}>
        <p style={{ ...styles.p, fontWeight: '500' }}>Look at your lists and check marks.</p>
        <p style={styles.p}>Which list has more check marks?</p>
        <p style={styles.p}>Is this surprising, or does it make sense given what has been happening in your life lately?</p>
        <p style={styles.p}>
          When comfort or coping activities get more check marks than values-based activities, this often tells us something important about what we are managing right now and what we need. This is important information that you can use to make decisions about how to spend your time and effort.
        </p>
        <div style={styles.infoBoxWhite}>
          <p style={{ ...styles.p, fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '1.5rem' }}>Action Step:</p>
          <p style={{ ...styles.p, paddingLeft: '1.5rem' }}>
            Look at your Part 3 activities that didn't get a check mark. Pick one. What's one small version of that activity you could do today, even if just for 5 minutes?
          </p>
        </div>
      </div>

      <div style={{ ...styles.infoBox, ...styles.infoBoxBlue }}>
        <p style={{ ...styles.p, fontStyle: 'italic' }}>
          Remember: This exercise isn't about judging yourself, but about understanding yourself with compassion and curiosity.
        </p>
        <p style={styles.p}>
          Understanding your patterns is the first step toward making changes that align with what matters most to you. If you would like support to explore these patterns further and make changes to live more in line with your values, a mental health professional can help.
        </p>
      </div>

      <button
        onClick={startTracking}
        style={{ ...styles.button, ...styles.btnSuccess }}
      >
        <Calendar size={20} />
        <span>Track Your Progress</span>
      </button>
      
      <button
        onClick={() => setShowQRCode(true)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        <>
          <QrCode size={20} />
          <span>Share</span>
        </>
      </button>

      <button
        onClick={handlePrint}
        style={{ ...styles.button, ...styles.btnSecondary }}
      >
        <Printer size={20} />
        <span>Print or Save as PDF</span>
      </button>
    </div>,

    // Progress Tracking View
    <div key="progress">
      <h2 style={styles.h2}>Your Progress Over Time</h2>
      
      {weeklyData.length === 1 && (
        <div style={{ ...styles.infoBox, ...styles.infoBoxSuccess }}>
          <p style={{ ...styles.p, fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}>Tracking Started!</p>
          <p style={{ ...styles.p, marginBottom: '0.75rem' }}>
            Your data is saved to this browser. Return to this page anytime to do check-ins and track your progress.
          </p>
          <p style={{ ...styles.p, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>How to use:</strong> Bookmark this page or save the QR code. Come back regularly and click "Check-In" to record which activities you did. Your progress will be saved automatically.
          </p>
          <p style={{ ...styles.p, fontSize: '0.875rem' }}>
            If you find it helpful, you can update your activity lists by recompleting the exercise. To do this, select "Start Over" from the home screen. Note that this will clear your tracking data.
          </p>
        </div>
      )}
      
      {weeklyData.length > 0 && (
        <>
          <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={styles.h3}>Activity Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={weeklyData.map(entry => ({
                  date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  Comfort: entry.comfortCount,
                  Values: entry.valuesCount
                }))}
                margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  label={{ value: 'Activities Done', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Comfort" 
                  stroke="#d97706" 
                  strokeWidth={3}
                  dot={{ fill: '#d97706', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Values" 
                  stroke="#059669" 
                  strokeWidth={3}
                  dot={{ fill: '#059669', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {weeklyData.length === 1 && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign:'center', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Your trend will develop as you complete more check-ins
              </p>
            )}
          </div>

          <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={styles.h3}>Check-In History</h3>
            {weeklyData.map((entry, index) => (
              <div key={index} style={styles.checkInEntry}>
                <span style={{ color: '#374151', fontWeight: '500' }}>
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Comfort</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{entry.comfortCount}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Values</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{entry.valuesCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...styles.infoBox, ...styles.infoBoxBlue }}>
            <h3 style={{ ...styles.h3, fontSize: '1.125rem' }}>Pattern Summary</h3>
            <p style={styles.p}>Total check-ins: {weeklyData.length}</p>
            <p style={styles.p}>Average comfort activities per check-in: {(weeklyData.reduce((sum, e) => sum + e.comfortCount, 0) / weeklyData.length).toFixed(1)}</p>
            <p style={styles.p}>Average values-based activities per check-in: {(weeklyData.reduce((sum, e) => sum + e.valuesCount, 0) / weeklyData.length).toFixed(1)}</p>
          </div>
        </>
      )}

      <button
        onClick={goToCheckIn}
        style={{ ...styles.button, ...styles.btnSuccess }}
      >
        Do Check-In
      </button>
      
      <button
        onClick={() => setShowQRCode(true)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        <>
          <QrCode size={20} />
          <span>Share</span>
        </>
      </button>

      <button
        onClick={() => setCurrentPart(0)}
        style={{ ...styles.button, ...styles.btnSecondary }}
      >
        Back to Home
      </button>
    </div>
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {showCheckIn ? (
          <div>
            <h2 style={styles.h2}>Check-In</h2>
            <p style={styles.p}>
              Check any activities you did in the past 7 days.
            </p>
            
            <div style={styles.grid}>
              <div style={{ ...styles.activityBox, ...styles.comfortBox }}>
                <h3 style={{ ...styles.h3, color: '#78350f' }}>Comfort Activities</h3>
                {comfortActivities.map((activity, index) => (
                  activity && (
                    <label key={index} style={styles.activityItem}>
                      <input
                        type="checkbox"
                        checked={comfortChecks[index]}
                        onChange={(e) => {
                          const newChecks = [...comfortChecks];
                          newChecks[index] = e.target.checked;
                          setComfortChecks(newChecks);
                        }}
                        style={styles.checkbox}
                      />
                      <span style={{ color: '#1f2937' }}>{activity}</span>
                    </label>
                  )
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fcd34d' }}>
                  <p style={{ fontWeight: 'bold', color: '#78350f' }}>
                    Total checked: {comfortChecks.filter(c => c).length}
                  </p>
                </div>
              </div>

              <div style={{ ...styles.activityBox, ...styles.valuesBox }}>
                <h3 style={{ ...styles.h3, color: '#065f46' }}>Values-Based Activities</h3>
                {valuesActivities.map((activity, index) => (
                  activity && (
                    <label key={index} style={styles.activityItem}>
                      <input
                        type="checkbox"
                        checked={valuesChecks[index]}
                        onChange={(e) => {
                          const newChecks = [...valuesChecks];
                          newChecks[index] = e.target.checked;
                          setValuesChecks(newChecks);
                        }}
                        style={styles.checkbox}
                      />
                      <span style={{ color: '#1f2937' }}>{activity}</span>
                    </label>
                  )
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #6ee7b7' }}>
                  <p style={{ fontWeight: 'bold', color: '#065f46' }}>
                    Total checked: {valuesChecks.filter(c => c).length}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={saveWeeklyCheckIn}
              style={{ ...styles.button, ...styles.btnSuccess }}
            >
              Save This Check-In
            </button>
            <button
              onClick={() => setCurrentPart(7)}
              style={{ ...styles.button, ...styles.btnPrimary }}
            >
              View Progress
            </button>
            <button
              onClick={() => setShowCheckIn(false)}
              style={{ ...styles.button, ...styles.btnSecondary }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            {showStartOverConfirm && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3 style={{ ...styles.h3, fontSize: '1.25rem' }}>Start Over?</h3>
                  <p style={styles.p}>
                    This will permanently delete all your saved activities and tracking data. Are you sure you want to start over?
                  </p>
                  <div style={styles.modalButtons}>
                    <button
                      onClick={confirmStartOver}
                      style={{ ...styles.button, ...styles.btnDanger, flex: 1, marginBottom: 0 }}
                    >
                      Yes, Start Over
                    </button>
                    <button
                      onClick={cancelStartOver}
                      style={{ ...styles.button, ...styles.btnSecondary, flex: 1, marginBottom: 0 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showQRCode && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3 style={{ ...styles.h3, fontSize: '1.25rem' }}>Share This Exercise</h3>
                  <p style={styles.p}>
                    Scan this QR code or share the link below to access this exercise from any device.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <QRCode 
                      value="https://avivino-eng.github.io/values-tracking/"
                      size={200}
                      level="H"
                    />
                  </div>
                  <p style={{ ...styles.p, fontSize: '0.875rem', textAlign: 'center', wordBreak: 'break-all' }}>
                    https://avivino-eng.github.io/values-tracking/
                  </p>
                  <button
                    onClick={() => setShowQRCode(false)}
                    style={{ ...styles.button, ...styles.btnPrimary, marginBottom: 0 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {currentPart > 0 && currentPart < 7 && (
              <div style={styles.progressBar}>
                <div style={styles.progressLabel}>
                  <span>Progress</span>
                  <span>{currentPart} of 6</span>
                </div>
                <div style={styles.progressTrack}>
                  <div 
                    style={{ ...styles.progressFill, width: `${(currentPart / 6) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {parts[currentPart]}

            {currentPart > 0 && currentPart < 7 && (
              <button
                onClick={() => setCurrentPart(currentPart - 1)}
                style={styles.backButton}
              >
                ← Back
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}