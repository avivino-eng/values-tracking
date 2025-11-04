import { useState, useEffect } from 'react';
import { Printer, Calendar, QrCode, Home, TrendingUp, Ban, Save } from 'lucide-react';
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
    
    @media print {
      .check-in-expanded {
        display: block !important;
      }
    }
  `;
  if (!document.head.querySelector('style[data-app-styles]')) {
    styleEl.setAttribute('data-app-styles', 'true');
    document.head.appendChild(styleEl);
  }
}

export default function ValuesWorksheet() {
  // Navigation / UI
  const [currentPart, setCurrentPart] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Activities
  const [comfortActivities, setComfortActivities] = useState(['', '', '', '', '']);
  const [valuesActivities, setValuesActivities] = useState(['', '', '', '', '']);
  const [selectedValues, setSelectedValues] = useState(['', '', '', '', '']);

  // Check states
  const [comfortChecks, setComfortChecks] = useState([false, false, false, false, false]);
  const [valuesChecks, setValuesChecks] = useState([false, false, false, false, false]);

  // Ratings and mood
  const [currentMood, setCurrentMood] = useState(null);
  const [comfortRating, setComfortRating] = useState(null);
  const [valuesRating, setValuesRating] = useState(null);

  // Progress tracking
  const [weeklyData, setWeeklyData] = useState([]);
  const [expandedCheckInIndex, setExpandedCheckInIndex] = useState(null);

  // Save check-in
  const saveWeeklyCheckIn = () => {
    // Get checked activities
    const checkedComfort = comfortActivities.filter((_, i) => comfortChecks[i]);
    const checkedValues = valuesActivities.filter((_, i) => valuesChecks[i]);

    // Build new entry
    const newEntry = {
      date: new Date().toISOString(),
      comfortCount: checkedComfort.length,
      valuesCount: checkedValues.length,
      mood: currentMood,
      comfortChecked: checkedComfort,
      valuesChecked: checkedValues,
      comfortActivities: comfortActivities,
      valuesActivities: valuesActivities,
      comfortRating,
      valuesRating
    };

    // Update weekly data
    const newWeeklyData = [...weeklyData, newEntry];
    setWeeklyData(newWeeklyData);

    // Save to localStorage
    localStorage.setItem('valuesWorksheetData', JSON.stringify({
      weeklyData: newWeeklyData,
      comfortActivities,
      valuesActivities,
      selectedValues,
      isTracking,
    }));

    // Reset check-in form
    setComfortChecks([false, false, false, false, false]);
    setValuesChecks([false, false, false, false, false]);
    setCurrentMood(3);
    setComfortRating(3);
    setValuesRating(3);

    // Close check-in panel
    setShowCheckIn(false);
  };

  // Scroll to top on part change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPart]);

  useEffect(() => {
  window.scrollTo(0, 0);
  }, [showCheckIn]);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('valuesWorksheetData');
    if (saved) {
      const data = JSON.parse(saved);
      setComfortActivities(data.comfortActivities || ['', '', '', '', '']);
      setValuesActivities(data.valuesActivities || ['', '', '', '', '']);
      setSelectedValues(data.selectedValues || ['', '', '', '', '']);
      setWeeklyData(data.weeklyData || []);
      setIsTracking(data.isTracking && data.weeklyData && data.weeklyData.length > 0);
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
    const checkedComfort = comfortActivities.filter((_, i) => comfortChecks[i]);
    const checkedValues = valuesActivities.filter((_, i) => valuesChecks[i]);
    
    const newEntry = {
      date: new Date().toISOString(),
      comfortCount: checkedComfort.length,
      valuesCount: checkedValues.length,
      comfortChecked: checkedComfort,
      valuesChecked: checkedValues,
      comfortActivities: comfortActivities,
      valuesActivities: valuesActivities
    };
    const newWeeklyData = [...weeklyData, newEntry];
    setWeeklyData(newWeeklyData);
    setIsTracking(true);
    saveData({ weeklyData: newWeeklyData, isTracking: true });
    setCurrentPart(7);
  };

  const goToCheckIn = () => {
    setComfortChecks([false, false, false, false, false]);
    setValuesChecks([false, false, false, false, false]);
    setComfortRating(weeklyData.length >= 1 ? 3 : null);
    setValuesRating(weeklyData.length >= 1 ? 3 : null);
    setCurrentMood(weeklyData.length >= 1 ? 3 : null);
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
    infoBoxGreen: {
      background: '#e6f9ee',
      borderLeft: '4px solid #34d399'
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
      cursor: 'pointer',
      backgroundColor: 'white',
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
      <h1 style={styles.h1}>Values Alignment Exercise</h1>
      <p style={styles.introText}>
        This exercise helps you see how your daily choices align with your values, and find small ways to move toward what is important to you. Use this exercise if you are struggling with low mood or feeling stuck.<br />It takes about 5 minutes.<br /><br />This app is only for honest personal use. None of your information is collected or shared. 
      </p>
      {isTracking && weeklyData.length > 0 ? (
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
            <TrendingUp size={20} />
            Progress
          </button>
          <button
            onClick={() => setShowQRCode(true)}
            style={{ ...styles.button, ...styles.btnSecondary }}
          >
            <>
              <QrCode size={20} />
              <span>Link</span>
            </>
          </button>
          <button
            onClick={handleStartOver}
            style={{ ...styles.button, ...styles.btnDanger }}
          >
            <Ban size={20} />
            Restart
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setCurrentPart(1)}
            style={{ ...styles.button, ...styles.btnPrimary }}
          >
            Begin
          </button>
        </div>
      )}
    </div>,    
    
    // Part 1
    <div key="part1">
      <h2 style={styles.h2}>Part 1: What are things you do regularly to help yourself feel better?</h2>
      <p style={styles.p}>
        We all have activities we use to help deal with stress and bad feelings. When life feels overwhelming, when we need immediate relief, or when we're dealing with something difficult, we turn to familiar comforts.
      </p>
      <p style={{ ...styles.p, fontWeight: '500' }}>
        List 5 activities you do regularly for immediate comfort, energy, entertainment, or to cope with something difficult:
      </p>
      <p style={{ ...styles.p, fontSize: '0.875rem', fontStyle: 'italic', color: '#6b7280' }}>
        Examples: Taking a nap, listening to music, scrolling social media, venting to a friend, watching TV, playing games, having a drink, sitting outside, comfort eating, browsing online, staying in bed, smoking or vaping, petting your dog or cat...
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
      <div style={{ ...styles.infoBox, ...styles.infoBoxGray }}>
        <p style={{ ...styles.p, marginTop: '0rem', marginBottom: '0rem' }}>
          This exercise focuses on values. Values are different from goals. A goal is something you can achieve or complete, like getting a job, losing weight, or making a friend. A value is an ongoing direction, like growing as a person, fostering wellbeing, or contributing to a community. Values cannot be finished or completed. We move toward or away from values through daily choices.
        </p>
      </div>

      <div style={{ ...styles.infoBox, ...styles.infoBoxGray }}>  
        <p style={{ ...styles.p, marginTop: '0rem', marginBottom: '0rem' }}>
          Values are also different from morals or judgements. Morals say whether things are right or wrong, and judgements say whether things are good or bad. Morals and judgements often tell us about things we should do to be good, or should not do to be not bad. Instead, your values are what you want, and how you want to be, because of what is important to you. A value cannot be right or wrong.
        </p>
      </div>

      <div style={{ ...styles.infoBox, ...styles.infoBoxGray }}>  
        <p style={{ ...styles.p, marginTop: '0rem', marginBottom: '0rem' }}>
          Next, reflect on how your values shape your choices and activities, and what your values might tell you about what you need or how you want to be. As you complete this task, remember to be curious and self-compassionate. There are no right or wrong or good or bad answers, only what is important to you.
        </p>
      </div>

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
        You might find some or all of these important. Think of some others that are unique to you. Choose 5 values that are important to you and rank them with the most important at the top.
      </p>
      <div style={{ ...styles.infoBox, ...styles.infoBoxGray }}>
        <p style={{ ...styles.p, fontWeight: '500', marginBottom: '0.5rem' }}>Common values:</p>
        <div style={styles.valueGrid}>
          {valuesList.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      </div>
      <p style={{ ...styles.p, fontWeight: '500' }}>List 5 important values in order:</p>
            
      {selectedValues.map((value, index) => {
        const getOrdinal = (n) => {
          const suffixes = ['th', 'st', 'nd', 'rd'];
          const v = n % 100;
          return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
        };

        const importance = index === 0 ? 'most important' : `${getOrdinal(index + 1)} most important`;

        return (
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
            placeholder={`Value ${index + 1} (${importance})`}
            style={styles.input}
          />
        );
      })}
      <button
        onClick={() => setCurrentPart(4)}
        style={{ ...styles.button, ...styles.btnPrimary }}
      >
        Continue
      </button>
    </div>,

    // Part 3
    <div key="part3">
      <h2 style={styles.h2}>Part 3: What activities connect you to these values?</h2>
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
        List 5 specific activities you do (or want to do) that connect to your values:
      </p>
      <p style={{ ...styles.p, fontSize: '0.875rem', fontStyle: 'italic', color: '#6b7280' }}>
        Examples: Calling family members, exercising, volunteering, creating art, studying, practicing faith, spending quality time with friends, working on meaningful projects, being in nature, helping colleagues...
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
      <h2 style={styles.h2}>Part 4: Which activities have you done recently?</h2>
      <p style={styles.p}>
        Now, look at all the activities you listed in Parts 1 and 3. Check any activities you did in the past 7 days.
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
          {comfortActivities.map((activity, index) => {
            const isChecked = comfortChecks[index];
            const hasContent = activity && activity.trim() !== '';
            if (!hasContent && !isChecked) return null;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
                <span style={{ fontSize: '1.125rem', color: '#1f2937' }}>{isChecked ? '✓' : '○'}</span>
                <span style={{ color: '#1f2937' }}>{hasContent ? activity : '—'}</span>
              </div>
            );
          })}
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
                <span style={{ fontSize: '1.125rem', color: '#1f2937' }}>{valuesChecks[index] ? '✓' : '○'}</span>
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
        <p style={{ ...styles.p, fontWeight: 'bold', textDecoration: 'underline' }}>Look at your lists and check marks.</p>
        <p style={styles.p}>Which list has more check marks?</p> 
        <p style={styles.p}>If an activity did not get a check, when was the last time you did that activity?</p>
        <p style={styles.p}>Is this surprising, or does it make sense given what has been happening in your life lately?</p>
        <p style={styles.p}>
          Every day, we make decisions about how to spend our time and energy. Some choices move us toward what we care deeply about. Others help us cope with stress or avoid difficult feelings. When we are struggling, our bodies and minds naturally seek relief and comfort.
        </p>
        <p style={styles.p}>
          If comfort activities get more check marks than values-based activities, it may say something important about what we are managing in the moment and what we need.
        </p>
        <div style={styles.infoBoxWhite}>
          <p style={{ ...styles.p, fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '1.5rem' }}>Action Step:</p>
          <p style={{ ...styles.p, paddingLeft: '1.5rem' }}>
            Look at your values-based activities that did not get a check mark. Pick one. What is one small version of that activity you could do today, even if just for 5 minutes?
          </p>
        </div>
      </div>

      <div style={{ ...styles.infoBox, ...styles.infoBoxBlue }}>
        <div style={styles.infoBoxWhite}>
          <p style={{ ...styles.p, fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '1.5rem' }}>Remember:</p>
          <p style={{ ...styles.p, fontStyle: 'italic', paddingLeft: '1.5rem' }}>
                      This exercise is not about judging yourself, it is about understanding yourself with compassion and curiosity.
                    </p>
                  </div>
                  <p style={styles.p}>
                    Understanding your patterns is the first step toward making changes that align with what matters most to you. If you would like support to explore these ideas and make changes to live more in line with your values, a mental health professional can help.
                  </p>  
                </div>
                
                <div style={{ ...styles.infoBox, ...styles.infoBoxGreen }}>
                  <p style={{ ...styles.p, textAlign:'center' }}>
                    You may find it helpful to return to this app to track how often you do certain activities over time.<br /><br />Give it a try!<br />Select <u><b>Track Your Progress</b></u> to get started.
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
                    onClick={() => setCurrentPart(0)}
                    style={{ ...styles.button, ...styles.btnPrimary }}
                  >
                    <Home size={20} />
                    Home
                  </button>
                
                  <button
                    onClick={() => setShowQRCode(true)}
                    style={{ ...styles.button, ...styles.btnSecondary}}
                  >
                    <>
                      <QrCode size={20} />
                      <span>Link</span>
                    </>
                  </button>
              </div>,

              <div key="progress">
                <h2 style={styles.h2}>Your Activity Log</h2>
                
                {weeklyData.length === 1 && (
                  <div style={{ ...styles.infoBox, ...styles.infoBoxSuccess }}>
                    <p style={{ ...styles.p, fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}><u>Great work</u> making it this far! Keep it up!</p>
                    <p style={{ ...styles.p, marginBottom: '0.75rem' }}>
                      Your data is saved to this device's browser. Return to this page on this device anytime to do check-ins and track your progress.
                    </p>
                    <p style={{ ...styles.p, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <strong>How to use:</strong> Bookmark this page or save the QR code. Come back regularly and select "Check-In" to record which activities you did. Checking in once a week is a great way to start. Can you work up to checking in every day?
                    </p>
                    <p style={{ ...styles.p, fontSize: '0.875rem' }}>
                      If you find it helpful, you can update your activity lists by starting over from the beginning. To do this, select "Restart" from the home screen. Note that this will clear your data.
                    </p>
                  </div>
                )}
                
                {weeklyData.length > 0 && (
                  <>
                    <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                      <h3 style={{ ...styles.h3, color: '#374151' }}>Trends</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart 
                          data={weeklyData.map(entry => ({
                            date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            Comfort: entry.comfortCount,
                            Values: entry.valuesCount,
                            Mood: entry.mood ?? null
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
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                          />
                          <Legend 
                            layout="horizontal" 
                            align="center" 
                            verticalAlign="bottom" 
                            wrapperStyle={{ bottom: 0 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Comfort"
                            name="Comfort Activities" 
                            stroke="#d97706" 
                            strokeWidth={3}
                            dot={{ fill: '#d97706', r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Values"
                            name="Values Activities" 
                            stroke="#059669" 
                            strokeWidth={3}
                            dot={{ fill: '#059669', r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                          {weeklyData.some(entry => entry.mood !== undefined && entry.mood !== null) && (
                          <Line 
                            type="monotone" 
                            dataKey="Mood"
                            stroke="#8b5cf6" 
                            strokeWidth={3}
                            dot={{ fill: '#8b5cf6', r: 5 }}
                            activeDot={{ r: 7 }}
                            connectNulls={true}
                          />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                      {weeklyData.length === 1 && (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign:'center', marginTop: '0.5rem', fontStyle: 'italic' }}>
                          Your trend will develop as you complete more check-ins
                        </p>
                      )}
                    </div>

                    <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                      <h3 style={{ ...styles.h3, color: '#374151' }}>Check-In History</h3>
                            <p style={{ ...styles.p, fontSize: '0.875rem', fontStyle: 'italic', color: '#6b7280' }}>
                              Tap pannel to expand
                            </p>
                      {weeklyData.map((entry, index) => (
                        <div
                          key={index}
                          style={{
                            cursor: 'pointer',
                            marginBottom: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#fff',
                          }}
                          onClick={() => setExpandedCheckInIndex(expandedCheckInIndex === index ? null : index)}
                        >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span style={{ color: '#374151', fontWeight: '500', marginBottom: '0.25rem' }}>
                            {new Date(entry.date).toLocaleDateString()}
                          </span>

                          <div style={{ display: 'flex', flex: 1, gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <div
                              style={{
                                flex: '1 1 80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'pre-wrap' }}>Comfort Activities</div>
                              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{entry.comfortCount}</div>
                            </div>

                            <div
                              style={{
                                flex: '1 1 80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'pre-wrap' }}>Values Activities</div>
                              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{entry.valuesCount}</div>
                            </div>

                            {entry.mood !== undefined && entry.mood !== null && (
                              <div
                                style={{
                                  flex: '1 1 80px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'flex-end',
                                  textAlign: 'center',
                                }}
                              >
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Mood</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{entry.mood}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div 
                          className="check-in-expanded"
                          style={{ 
                            marginTop: '0.5rem', 
                            padding: '0.75rem', 
                            backgroundColor: '#f9fafb', 
                            borderRadius: '0.5rem', 
                            color: '#1f2937',
                            display: expandedCheckInIndex === index ? 'block' : 'none'
                          }}
                        >
                          <p style={{ marginBottom: '0.25rem', fontWeight: 'bold', color: '#1f2937' }}>Comfort Activities Checked:</p>
                          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                            {entry.comfortChecked && entry.comfortChecked.length > 0 ? (
                              entry.comfortChecked.map((act, i) => (
                                <li key={i} style={{ wordBreak: 'break-word' }}>{act}</li>
                              ))
                            ) : (
                              <li style={{ wordBreak: 'break-word', color: '#6b7280' }}>None</li>
                            )}
                          </ul>
                              <p style={{ margin: '0.5rem 0 0.25rem', fontWeight: 'bold', color: '#1f2937' }}>Values Activities Checked:</p>
                              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                {entry.valuesChecked && entry.valuesChecked.length > 0 ? (
                                  entry.valuesChecked.map((act, i) => (
                                    <li key={i} style={{ wordBreak: 'break-word' }}>{act}</li>
                                  ))
                                ) : (
                                  <li style={{ wordBreak: 'break-word', color: '#6b7280' }}>None</li>
                                )}
                              </ul>

                              {entry.mood !== undefined && entry.mood !== null && (
                                <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Mood: {entry.mood}</p>
                              )}

                              {entry.comfortRating !== undefined && entry.comfortRating !== null && (
                                <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#1f2937' }}>Comfort Reward: {entry.comfortRating}</p>
                              )}
                              {entry.valuesRating !== undefined && entry.valuesRating !== null && (
                                <p style={{ marginTop: '0.25rem', fontWeight: 'bold', color: '#1f2937' }}>Values Reward: {entry.valuesRating}</p>
                              )}
                            </div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ ...styles.infoBox, ...styles.infoBoxBlue }}>
                      <h3 style={{ ...styles.h3, color: '#374151' }}>Summary</h3>
                      <p style={styles.p}>Total check-ins: {weeklyData.length}</p>
                      <p style={styles.p}>Average comfort activities per check-in: {(weeklyData.reduce((sum, e) => sum + e.comfortCount, 0) / weeklyData.length).toFixed(1)}</p>
                      <p style={styles.p}>Average values-based activities per check-in: {(weeklyData.reduce((sum, e) => sum + e.valuesCount, 0) / weeklyData.length).toFixed(1)}</p>
                      {weeklyData.some(e => e.comfortRating !== null && e.comfortRating !== undefined) && (
                        <p style={styles.p}>Average comfort reward rating: {(weeklyData.filter(e => e.comfortRating !== null && e.comfortRating !== undefined).reduce((sum, e) => sum + e.comfortRating, 0) / weeklyData.filter(e => e.comfortRating !== null && e.comfortRating !== undefined).length).toFixed(1)}</p>
                      )}
                      {weeklyData.some(e => e.valuesRating !== null && e.valuesRating !== undefined) && (
                        <p style={styles.p}>Average values reward rating: {(weeklyData.filter(e => e.valuesRating !== null && e.valuesRating !== undefined).reduce((sum, e) => sum + e.valuesRating, 0) / weeklyData.filter(e => e.valuesRating !== null && e.valuesRating !== undefined).length).toFixed(1)}</p>
                      )}
                    </div>
                  </>
                )}
                  <button
                    onClick={goToCheckIn}
                    style={{ ...styles.button, ...styles.btnSuccess }}
                  >
                    <Calendar size={20} />
                    Check-In
                  </button>

                  <button
                    onClick={() => setCurrentPart(0)}
                    style={{ ...styles.button, ...styles.btnPrimary }}
                  >
                    <Home size={20} />
                    Home
                  </button>
                  
                  <button
                    onClick={() => setShowQRCode(true)}
                    style={{ ...styles.button, ...styles.btnSecondary }}
                  >
                    <>
                      <QrCode size={20} />
                      <span>Link</span>
                    </>
                  </button>

                  <button
                    onClick={handlePrint}
                    style={{ ...styles.button, ...styles.btnSecondary }}
                  >
                    <Printer size={20} />
                    PDF
                  </button>

                  {weeklyData.length === 2 && (
                    <div style={{ ...styles.infoBox, ...styles.infoBoxSuccess, marginTop: '1.5rem' }}>
                      <p style={{ ...styles.p, fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}><u>Great work</u> making it this far! Keep it up!</p>
                    <p style={{ ...styles.p, marginBottom: '0.75rem' }}>
                      Your data is saved to this device's browser. Return to this page on this device anytime to do check-ins and track your progress.
                    </p>
                    <p style={{ ...styles.p, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <strong>How to use:</strong> Bookmark this page or save the QR code. Come back regularly and select "Check-In" to record which activities you did. Checking in once a week is a great way to start. Can you work up to checking in every day?
                    </p>
                    <p style={{ ...styles.p, fontSize: '0.875rem' }}>
                      If you find it helpful, you can update your activity lists by starting over from the beginning. To do this, select "Restart" from the home screen. Note that this will clear your data.
                    </p>
                    </div>
                  )}
              </div>
            ];

            return (
              <div style={styles.container}>
                <div style={styles.card}>
                  {showCheckIn ? (
            <div>
              <h2 style={{ ...styles.h2, color: '#1f2937', marginBottom: '2rem' }}>Check-In</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.125rem', color: '#1f2937' }}>
                  How are you feeling?
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={currentMood}
                    onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                    style={{ 
                      flex: 1,
                      accentColor: '#2563eb',
                      height: '8px'
                    }}
                  />
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', minWidth: '3rem', textAlign: 'center' }}>
                    {currentMood}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '0', paddingRight: '3rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>1</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Worst</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>5</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Best</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <p style={{ ...styles.p, fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
                  Check any activities you did recently.
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
              </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ ...styles.h3, fontSize: '1.125rem', marginBottom: '1.5rem', color: '#374151' }}>Rate Your Activities</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500', color: '#374151' }}>
                Overall, how rewarding were your comfort activities this week?
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={comfortRating || 3}
                  onChange={(e) => setComfortRating(parseInt(e.target.value))}
                  style={{ 
                    flex: 1,
                    accentColor: '#d97706',
                    height: '8px'
                  }}
                />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d97706', minWidth: '2rem', textAlign: 'center' }}>
                  {comfortRating || '-'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '0', paddingRight: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>1</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>None</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>5</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Very</div>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500', color: '#374151' }}>
                Overall, how rewarding were your values-based activities this week?
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={valuesRating || 3}
                  onChange={(e) => setValuesRating(parseInt(e.target.value))}
                  style={{ 
                    flex: 1,
                    accentColor: '#059669',
                    height: '8px'
                  }}
                />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669', minWidth: '2rem', textAlign: 'center' }}>
                  {valuesRating || '-'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '0', paddingRight: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>1</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>None</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>5</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Very</div>
                </div>
              </div>
            </div>
          </div>

              <button
                onClick={() => {
                  saveWeeklyCheckIn();
                  setCurrentPart(7);
                  setShowCheckIn(false);
                }}      
                style={{ ...styles.button, ...styles.btnSuccess }}
              >
                <Save size={20} />
                Save
              </button>
              <button
                onClick={() => {
                  setCurrentPart(7);
                  setShowCheckIn(false);
                }}
                style={{ ...styles.button, ...styles.btnPrimary }}
              >
                <TrendingUp size={20} />
                Progress
              </button>
              <button
                onClick={() => {
                  setCurrentPart(0);
                  setShowCheckIn(false);
                }}
                style={{ ...styles.button, ...styles.btnSecondary }}
              >
                <Home size={20} />
                Home
              </button>
            </div>
                  ) : (
                    <>
                      {showStartOverConfirm && (
                        <div style={styles.modal}>
                          <div style={styles.modalContent}>
                            <h3 style={{ ...styles.h3, color: '#1f2937', fontSize: '1.25rem' }}>Start over from the beginning?</h3>
                            <p style={styles.p}>
                              This will allow you to set new activity lists, but will permanently delete all your saved activities and tracking data. Are you sure you want to start over?
                            </p>
                            <div style={styles.modalButtons}>
                              <button
                                onClick={confirmStartOver}
                                style={{ ...styles.button, ...styles.btnDanger, flex: 1, marginBottom: 0 }}
                              >
                                Yes, Restart
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
                            <h3 style={{ ...styles.h3, color: '#1f2937', fontSize: '1.25rem' }}>Link</h3>
                            <p style={styles.p}>
                              Use the QR code or the link below to access the values alignment exercise home page.
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