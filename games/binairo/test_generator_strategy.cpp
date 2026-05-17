#include <bits/stdc++.h>
using namespace std;

#define _rep(i,a,b) for (int i=(a);i<=(b);++i)
#define _reps(i,a,b,c) for (int i=(a);i<=(b);c)
#define _rrep(i,a,b) for (int i=(a);i>=(b);--i)
#define _rreps(i,a,b,c) for (int i=(a);i>=(b);c)

const int N=25;

int n=6;
int arr[N][N];

int main() {
    _rep(i,1,n) _rep(j,1,n) arr[i][j]=((i+j)&1);
    _rep(i,2,n) {
        bool ok;
        if (i<=3) ok=true;
        else if (arr[i][1]==arr[i-2][1] && arr[i][1]==arr[i-3][1]) ok=false;
        else ok=true;
        if (!ok) continue;
        int r=(rand()&1);
        if (r) _rep(j,1,n) swap(arr[i][j],arr[i-1][j]);
    }
    _rep(i,2,n) {
        bool ok;
        if (i<=3) ok=true;
        else if (arr[1][i]==arr[1][i-2] && arr[1][i]==arr[1][i-3]) ok=false;
        else ok=true;
        if (!ok) continue;
        int r=(rand()&1);
        if (r) _rep(j,1,n) swap(arr[j][i],arr[j][i-1]);
    }
    cout<<"Test board:"<<endl;
    _rep(i,1,n) {
        _rep(j,1,n) cout<<arr[i][j]<<" ";
        cout<<endl;
    }
    return 0;
}